FROM python:3.12-slim

WORKDIR /app

# rasterio needs libexpat1
RUN apt-get update && apt-get install -y libexpat1

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY api /app/api/
COPY lhasa /app/lhasa/
COPY data /app/data/

EXPOSE 8000

ENTRYPOINT ["uvicorn", "api.index:app", "--host", "0.0.0.0", "--port", "8000"]