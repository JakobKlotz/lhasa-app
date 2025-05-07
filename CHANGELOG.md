# Changelog

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
