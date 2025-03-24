# Changelog

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
