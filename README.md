![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=white)

# LHASA app

Visualize the latest LHASA predictions to assess *landslide risks*.

![](screenshot/screenshot.png)

## Development

Tech stack:

- FastAPI: To fetch the latest predictions and generate maps.
- Next.js: To display the maps.

To build and run the project, simply use `Docker` with:

```bash
docker compose up -d --build
```

The app is available at `localhost:3000`

## Reference

The aim of this project is to simply visualize the results from the LHASA
(Landslide Hazard Assessment for Situational Awareness). Visit the corresponding
repo [here](https://github.com/nasa/LHASA). LHASA was developed by:

> [!NOTE]
> Khan, S., D. B. Kirschbaum, T. A. Stanley, P. M. Amatya, and R. A. Emberson. 2022. "Global Landslide Forecasting System for Hazard Assessment and Situational Awareness." Frontiers in Earth Science, 10: 10.3389/feart.2022.878996

LHASA:
Copyright © 2020 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.