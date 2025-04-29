import json
from contextlib import asynccontextmanager
from pathlib import Path

import geopandas as gpd
import plotly.utils
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from lhasa import Downloader, ForeCast, read_nuts

nuts: gpd.GeoDataFrame | None = None
countries: gpd.GeoDataFrame | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
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
    try:
        downloader = Downloader()
        downloader.run()
        return {"message": "Files downloaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/countries")
async def get_countries():
    return JSONResponse(countries.to_dict(orient="records"))


@app.get("/forecast/{nuts_id}")
async def get_forecast(nuts_id: str, day: str = "tomorrow"):
    try:
        # Find the latest downloaded file
        files = list(Path("data").glob(f"*_{day}.tif"))
        if not files:
            raise FileNotFoundError(f"No {day}.tif file found")

        latest_file = max(files, key=lambda p: p.stat().st_mtime)

        # Create forecast
        forecast = ForeCast(tif_path=latest_file, nuts=nuts)

        # Generate plot
        fig = forecast.plot(
            nuts_id=nuts_id,
            title=f"Landslide forecast for {day} - <i>{nuts_id}</i><br>"
            f"Forecast created on: {latest_file.name.split(' ')[0]}",
        )

        # Convert plot to JSON
        return JSONResponse(
            json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
