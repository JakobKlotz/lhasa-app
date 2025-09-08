# Taken and modified from 
# https://github.com/astral-sh/uv-docker-example/blob/main/standalone.Dockerfile

# Build stage
FROM astral/uv:trixie-slim AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Configure the Python directory so it is consistent
ENV UV_PYTHON_INSTALL_DIR=/python

# Only use the managed Python version
ENV UV_PYTHON_PREFERENCE=only-managed

WORKDIR /app

# To build rasterio we need libexpat1
RUN apt-get update && apt-get install -y libexpat1

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev

# Copy necessary files
COPY pyproject.toml uv.lock /app/
COPY app /app/app
COPY lhasa /app/lhasa

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Final image
FROM debian:trixie-slim

# Rasterio needs libexpat1, ca-certificates to verify SSL
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libexpat1 ca-certificates curl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# Copy the Python version
COPY --from=builder --chown=python:python /python /python

# Add a non-root user to run the application
RUN groupadd --system --gid 1001 app
RUN useradd --system -g app --uid 1001 app

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Reset WORKDIR to the app directory
WORKDIR /app

EXPOSE 8000

# Switch to non-root user
USER app

CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]