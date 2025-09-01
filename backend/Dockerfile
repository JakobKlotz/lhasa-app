FROM python:3.12-slim
# pin uv version 0.8.3
COPY --from=ghcr.io/astral-sh/uv:0.8.3 /uv /uvx /bin/

WORKDIR /app

# rasterio needs libexpat1
RUN apt-get update && apt-get install -y libexpat1

# set-up the environment
COPY pyproject.toml uv.lock /app/ 
# sync without updating the uv.lock file
RUN uv sync --frozen

# copy necessary files
COPY api /app/api/
COPY lhasa /app/lhasa/
COPY data /app/data/

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "8000"]