# Changelog

## Version - 0.3.3

Added a multistage Dockerfile to reduce the image size of the backend service
(the API).

### ⬆ Dependencies

**Backend**:

- Upgraded the Python version to `3.13`.

### 🧹 Chores/Refactoring

**Backend**

- Multistage Dockerfile:
    - Replaced the single-stage image with a multistage build (builder + runtime) 
    to separate build-time dependencies from the final runtime image, which 
    significantly reduces the final image size.
    - Added a non-root user to run the API.
- Renamed the API directory and entry file to better align with the official 
    FastAPI recommendations (adopting the conventional `app/main.py` layout) to 
    improve project structure and clarity.
- Updated the `pre-commit` hooks

## Version - 0.3.2

Fixed security vulnerabilities.

### ⬆ Dependencies

**Frontend**:

- Updated `next.js` to `15.5.2` in order to resolve the dependabot alerts.

**Backend**:

- Dockerfile: Switched from `python:3.12-slim-bookworm` to `python:3.12-slim`
    to resolve a vulnerability of high severity. 

## Version - 0.3.1

Minor changes to the backend and frontend of the app.

### ✨ Features

**Frontend**:

Slight changes to the statistics dialog:

- Replaced both the minimum and maximum probability values with the 
    standard deviation and 98% quantile. Since min and max values were not very
    informative, this change should provide a better understanding of the 
    forecast data.
- Added some tooltips to the statistics dialog for a better understanding of 
    the displayed values.

### 🧹 Chores/Refactoring

**Backend**:

Since release `0.3.0`, the app no longer provides a selector for European states.
Hence, all related code and files were removed:

- Removed `NUTS_RG_20M_2024_4326.geojson` holding the country borders of 
    European states.
- Removed `lhasa/forecast.py` and the `ForeCast` class, which was used to plot 
    the LHASA forecast for a specific European state.
- Corresponding and already deprecated endpoints `/forecast` and `/countries` 
    were removed as well.

### ⬆ Dependencies

- **Backend**:
    - Removed `plotly`, `geopandas` and `shapely` as they were only used to 
        plot the LHASA forecast for a specific European state.
    - Pinned to the latest `uv` version `0.8.3` in the `Dockerfile`.

- **Frontend**:
    - Upgraded `axios` to `1.11.0` and `form-data` to `4.0.4` to fix a 
        security vulnerability.

## Version - 0.3.0

With the help of a dynamic tiling system, the landslide hazard map is now
available **globally**!

### ✨ Features

- **Backend**:
    - Added a new endpoint `/tiles` for dynamic tiling of a GeoTIFF file.
    - `/statistics` returns statistics of a GeoTIFF file.
    - `/bounds` simply returns the bounds of a GeoTIFF file.

- **Frontend**:
    - A global map is now available to visualize the LHASA forecast.
        - Customization options allow to set the opacity of the forecast layer
            and the background map (basemap).
    - A newly introduced `View Statistics` button allows to view rudimentary 
        statistics of a selected LHASA forecast.
    - By default, the latest available forecast is loaded on startup.
    - Upon the selection of a specific date, all page content is automatically
        updated, which should improve the user experience. Additional UI 
        elements, provide user feedback as to which date is currently selected.

### 🧹 Chores

Since, the app no longer provides a selector for European states, a couple of 
changes were made to both the backend and frontend:

- **Backend**:
    - API:
        - Marked the `/forecast` endpoint as deprecated, which was used to 
            visualize the forecast for a specific European state with `plotly`.
        - Marked the `/countries` endpoint as deprecated (lists all available 
            European states).
    - The `ForeCast` class handling the plotting of European states was 
        marked as deprecated as well.
    
> [!NOTE]
> Both endpoints and the `ForeCast` class will be removed in upcoming versions.
    
- **Frontend**:
    - Removed all UI elements related to the selection of European states,
        such as the dropdown menu and the corresponding map.

### ⬆ Dependencies

- **Backend**:
    - Added `rio-tiler` to handle the dynamic tiling of GeoTIFF files.
- **Frontend**:
    - Added `react-leaflet` and `leaflet` to add the global map including the
        forecast layer.

## Version - 0.2.0

Overhaul to both the backend and frontend of the app. Biggest changes are:

- No need to manually download the LHASA data anymore. Latest predictions are 
    automatically downloaded.
- Prediction data is now automatically downloaded and accumulated (if the 
    container is kept running). A new date picker allows you to select and 
    view forecasts for specific dates.

### ✨ Features

- **Backend**:
    - Added a scheduler to check for new LHASA data every 60 minutes and 
        download it if available.
    - Upon the first initialization of the API, the latest LHASA data is 
        downloaded.
    - Added a new endpoint `/` as a health check for the API.
    - Added `/files` to list all available LHASA files with their 
        corresponding dates.
    - `/forecast` now requires a `tif` parameter to specify the specific 
        LHASA file to be used for the forecast. This allows the user to pick
        a date of interest in the frontend.

- **Frontend**:
    - A new status indicator periodically checks (every 5 minutes) if the 
        backend is up and running.
    - The date picker allows to select forecasts for specific dates (if the 
        data is available on your machine).
    - An About page displays more information on the project.
    - Light and dark mode is introduced.
    - Stylistic changes to improve the user experience.

### ⬆ Dependencies

- **Backend**:
    - Pin to the latest version of `uv` in the `Dockerfile`
    - Added `apscheduler` to periodically check for new data

- **Frontend**:
    - Removed unused dependencies (`@emotion/react`, `@emotion/styled`)
    - Added `@mui/x-date-pickers` and `dayjs`
    - Updated remaining dependencies

## Version - 0.1.0

- Initial release of the app. 🚀

### Description

Visualize the latest LHASA predictions with an app to assess landslide risks.
Currently, predictions are displayed for a user selected European state.

---

> [!NOTE]
> All forecast data is taken directly from the LHASA project. Visit the corresponding LHASA repository [here](https://github.com/nasa/lhasa).

LHASA was developed by:

Khan, S., D. B. Kirschbaum, T. A. Stanley, P. M. Amatya, and R. A. Emberson. 2022. "Global Landslide Forecasting System for Hazard Assessment and Situational Awareness." Frontiers in Earth Science, 10: 10.3389/feart.2022.878996

### Background

The code within this project is divided into `backend/` and `frontend/`.
With the backend being a FastAPI app to download and process data from LHASA.
Whereas, the frontend (Next.js app) interacts with the API to display the 
landslide forecast.

Both backend and frontend are being split into two separate `Docker` 
containers which can be easily built and deployed with `docker compose`.
