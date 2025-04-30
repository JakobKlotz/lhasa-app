import json
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import geopandas as gpd
import pandas as pd
import plotly.utils
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from lhasa import Downloader, ForeCast, read_nuts

nuts: gpd.GeoDataFrame | None = None
countries: gpd.GeoDataFrame | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    """Lifespan event to load initial data."""
    global countries, nuts
    try:
        # prepare countries data
        nuts = read_nuts("data/NUTS_RG_20M_2024_4326.geojson")
        countries = nuts[nuts["LEVL_CODE"] == 0]
        countries = countries[["NUTS_ID", "NAME_LATN"]]
        countries = countries.rename(
            columns={"NUTS_ID": "code", "NAME_LATN": "label"}
        )

        # get latest available LHASA forecast
        downloader = Downloader()
        latest_date = downloader.get_latest_date()

        trigger_download = True
        for existing_file in Path("data").glob("*.tif"):
            if latest_date in existing_file.name:
                print(f"Latest file already exists: {existing_file.name}")
                trigger_download = False
                break

        if trigger_download:
            downloader.run()
        yield
    except Exception as e:
        raise RuntimeError("Failed to load initial data") from e


app = FastAPI(title="LHASA API", lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Welcome to the LHASA API"}


@app.post("/download")
async def download_data():
    downloader = Downloader()
    downloader.run()
    return {"message": "Files downloaded successfully"}


@app.get("/countries")
async def get_countries():
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


@app.get("/forecast")
async def get_forecast(nuts_id: str, tif: str):
    """Visualize forecast for given NUTS ID and date."""
    tif = Path("data") / tif
    # Create forecast
    forecast = ForeCast(tif_path=tif, nuts=nuts)
    day, forecast_type = tif.name.split("_")
    day = day.split("T")[0]

    # Generate plot
    fig = forecast.plot(
        nuts_id=nuts_id,
        title=f"Landslide forecast for {forecast_type} - <i>{nuts_id}</i><br>"
        f"Forecast created on: {day}",
    )

    # Convert plot to JSON
    return JSONResponse(
        json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
    )


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
