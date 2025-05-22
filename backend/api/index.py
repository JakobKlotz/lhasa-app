import asyncio
import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import geopandas as gpd
import pandas as pd
import plotly.utils
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rio_tiler.io import Reader
from starlette.responses import Response

from lhasa import Downloader, ForeCast, read_nuts

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

nuts: gpd.GeoDataFrame | None = None
countries: gpd.GeoDataFrame | None = None
DATA_DIR = Path("data")
SCHEDULER_MINUTES = 60  # Scheduler interval in minutes

# Initialize scheduler for automatic downloading of LHASA data
scheduler = AsyncIOScheduler(timezone="UTC")


def check_if_latest_data_exists(
    downloader: Downloader,
) -> tuple[bool, str | None]:
    """Checks if the latest data file already exists locally."""
    try:
        latest_date_str = downloader.get_latest_date()
        latest_file = f"{latest_date_str}_tomorrow.tif"
        if Path(DATA_DIR, latest_file).exists():
            logger.info(f"Latest data file already exists: {latest_file}")
            return True, latest_file

        logger.info(
            f"Latest data file for date {latest_file} not found locally."
        )
        return False, latest_file

    except Exception as e:
        logger.error(f"Error checking for latest data: {e}", exc_info=True)
        return (
            True,
            None,
        )  # Err on the side of caution, don't trigger download if check fails


async def check_and_download_latest_data():
    """Scheduled task to check for and download the latest data."""
    logger.info("Scheduler: Running check for latest data...")
    try:
        downloader = Downloader()
        exists, latest_file = check_if_latest_data_exists(downloader)

        if not exists and latest_file:
            logger.info(
                f"Scheduler: New data detected ({latest_file})."
                f"Attempting download."
            )
            try:
                # Run download in a separate thread to avoid blocking asyncio
                # event loop if it's synchronous
                loop = asyncio.get_running_loop()
                await loop.run_in_executor(
                    None, downloader.download_tomorrow(folder=DATA_DIR)
                )
                # Verify download
                exists_after, _ = check_if_latest_data_exists(downloader)
                if exists_after:
                    logger.info(
                        f"Scheduler: Download successful for {latest_file}."
                    )
                else:
                    logger.error(
                        f"Scheduler: Download command ran for {latest_file}, "
                        f"but file still not found."
                    )
            except Exception as download_error:
                logger.error(
                    f"Scheduler: Data download failed for {latest_file}: "
                    f"{download_error}",
                    exc_info=True,
                )
        elif exists:
            logger.info(
                f"Scheduler: Data {latest_file} is already up-to-date."
            )
        else:
            logger.warning(
                "Scheduler: Could not determine latest version to download."
            )

    except Exception as task_error:
        logger.error(
            f"Scheduler: Error during check/download task: {task_error}",
            exc_info=True,
        )


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    """Lifespan event to load initial data."""
    global countries, nuts
    logger.info("Application startup: Loading initial data...")
    # Ensure data directory exists
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    try:
        nuts_file = DATA_DIR / "NUTS_RG_20M_2024_4326.geojson"
        if not nuts_file.exists():
            logger.warning(f"NUTS file not found at {nuts_file}")
        else:
            # prepare countries data
            nuts = read_nuts(nuts_file)
            countries = nuts[nuts["LEVL_CODE"] == 0]
            countries = countries[["NUTS_ID", "NAME_LATN"]]
            countries = countries.rename(
                columns={"NUTS_ID": "code", "NAME_LATN": "label"}
            )

        # Add the job to the scheduler, run immediately on startup
        # (trigger='interval' doesn't run instantly)
        await check_and_download_latest_data()  # Run once on startup
        scheduler.add_job(
            check_and_download_latest_data,
            "interval",
            minutes=SCHEDULER_MINUTES,  # Check every minute
            id="check_data_job",
            replace_existing=True,
            # Allow 5 minutes grace period if scheduler was down
            misfire_grace_time=300,
        )
        # Start the scheduler
        scheduler.start()
        logger.info(
            f"Background scheduler started. Will check for data every "
            f"{SCHEDULER_MINUTES} minutes."
        )

        yield  # Application runs here

        # On shutdown, stop the scheduler
        logger.info("Application shutdown: Stopping scheduler...")
        scheduler.shutdown()
        logger.info("Scheduler stopped.")

    except Exception as e:
        logger.error(
            f"Fatal error during application lifespan setup: {e}",
            exc_info=True,
        )
        # Ensure scheduler is shutdown even if startup fails partially
        if scheduler.running:
            scheduler.shutdown(wait=False)
        raise HTTPException(
            status_code=500, detail="Application failed to initialize"
        ) from e


app = FastAPI(title="LHASA API", lifespan=lifespan)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Welcome to the LHASA API"}


@app.get("/countries", deprecated=True)
async def get_countries():
    """Get list of European countries with their NUTS ID and polygon border."""
    return JSONResponse(countries.to_dict(orient="records"))


@app.get("/files")
async def get_files(forecast_type: str = "tomorrow"):
    """List all files available for each day with the latest time stamp."""
    # Get all files in the data directory
    files = list(Path("data").glob(f"*_{forecast_type}.tif"))
    latest_files_per_day = {
        "file_name": [],
        "datetime": [],
        "day": [],
        "time": [],
    }
    if files:
        for file in files:
            # get date and time from file name
            date_str = file.name.split("_")[0]
            # convert to datetime object (e.g., "2025-04-30 04-46")
            dt = datetime.strptime(date_str, "%Y-%m-%dT%H-%M-%S")
            # append latest download from each day to available_dates
            latest_files_per_day["file_name"].append(file.name)
            latest_files_per_day["datetime"].append(dt)
            latest_files_per_day["day"].append(dt.date())
            latest_files_per_day["time"].append(dt.time())

    latest_files_per_day = pd.DataFrame(latest_files_per_day)
    # Group by day and get the row with maximum time for each day
    if not latest_files_per_day.empty:
        latest_files_per_day = latest_files_per_day.loc[
            latest_files_per_day.groupby("day")["time"].idxmax()
        ]
        latest_files_per_day = latest_files_per_day.set_index("day", drop=True)
    return latest_files_per_day.to_dict(orient="index")


@app.get("/forecast", deprecated=True)
async def get_forecast(nuts_id: str, tif: str):
    """Visualize forecast for given NUTS ID and date."""
    tif = Path("data") / tif
    if not tif.exists():
        raise HTTPException(
            status_code=404, detail=f"Forecast file not found: {tif}"
        )
    # Create forecast
    forecast = ForeCast(tif_path=tif, nuts=nuts)
    day, forecast_type = tif.name.split("_")
    day = day.split("T")[0]

    # Generate plot
    fig = forecast.plot(
        nuts_id=nuts_id,
        title=f"Landslide forecast for <i>{nuts_id}</i><br>"
        f"Forecast created on: {day}",
    )

    # Convert plot to JSON
    return JSONResponse(
        json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    )


@app.get("/bounds")
def get_bounds(tif: str):
    """Get bounds of the given GeoTIFF file."""
    tif_path = Path("data") / tif
    if not tif_path.exists():
        raise HTTPException(
            status_code=404, detail=f"GeoTIFF file not found: {tif}"
        )

    with Reader(tif_path) as cog:
        return cog.bounds


# taken and adapted from
# https://cogeotiff.github.io/rio-tiler/advanced/dynamic_tiler/#apppy
@app.get(
    r"/tiles/{z}/{x}/{y}.png",
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Return an image.",
        }
    },
    response_class=Response,
    description="Read GeoTIFF and return a tile",
)
def tile(z: int, x: int, y: int, tif: str):
    """Handle tile requests for GeoTIFF files."""
    tif_path = Path("data") / tif
    if not tif_path.exists():
        raise HTTPException(
            status_code=404, detail=f"GeoTIFF file not found: {tif_path}"
        )

    # custom colormap to handle float values and nodata values
    # without the colormap, raster_tile would attempt a conversion to
    # int which produces undesired results
    cmap = [
        # nodata values = -9999.0
        ((-9999.0, 0.0), (0, 0, 0, 0)),  # Transparent black
        ((0.0, 0.25), (201, 242, 155, 255)),  # Green
        ((0.25, 0.5), (255, 255, 153, 255)),  # Light Yellow
        ((0.5, 0.75), (255, 140, 0, 255)),  # Dark Orange
        ((0.75, 1.0), (217, 30, 24, 255)),  # Red
    ]

    with Reader(tif_path) as src:
        img = src.tile(x, y, z)
    # https://cogeotiff.github.io/rio-tiler/colormap/
    content = img.render(img_format="PNG", colormap=cmap)
    return Response(content, media_type="image/png")


@app.get("/statistics")
def get_statistics(tif: str):
    """Get global statistics of the given GeoTIFF file."""
    tif_path = Path("data") / tif
    if not tif_path.exists():
        raise HTTPException(
            status_code=404, detail=f"GeoTIFF file not found: {tif}"
        )

    with Reader(tif_path) as src:
        # Specific GeoTIFF files have a single band
        return src.statistics().get("b1")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # local dev and production env
        "http://localhost:3001",  # for local dev if docker is running as well
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
