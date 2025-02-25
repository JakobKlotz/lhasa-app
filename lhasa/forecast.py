from pathlib import Path

import geopandas as gpd
import numpy as np
import plotly.graph_objects as go
import rasterio
from rasterio.mask import mask, raster_geometry_mask
from shapely import MultiPolygon, Polygon
from shapely.geometry import mapping


class ForeCast:
    def __init__(self, *, tif_path: str | Path, nuts_path: str | Path):
        """Visualize LHASA predictions for a given NUTS region.
        NUTS regions can be downloaded from:
        https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics

        Args:
            tif_path (str | Path): Tif file with predictions.
            nuts_path (str | Path): The path to the NUTS geojson file.
        """
        self.tif_path = Path(tif_path)
        self.nuts = gpd.read_file(nuts_path)

    def plot(self, *, nuts_id: str, title: str) -> go.Figure:
        """Plot the predictions for the given NUTS region.

        Args:
            nuts_id (str): The NUTS ID of the region.
            title (str): The title of the plot.

        Returns:
            go.Figure: The plotly figure.
        """
        nuts_polygon = self.nuts[self.nuts["NUTS_ID"] == nuts_id][
            "geometry"
        ].iloc[0]
        predictions, border = self.read(nuts_polygon)

        return self.create_plot(predictions, border, title=title)

    def read(
        self, mask_polygon: Polygon | MultiPolygon
    ) -> tuple[np.ndarray, np.ndarray]:
        """Subset tif by given Polygon or MultiPolygon."""
        with rasterio.open(self.tif_path) as src:
            # number of bands
            if src.count != 1:
                raise ValueError(f"Expected 1 band, got {src.count}")
            if src.crs != "EPSG:4326":
                raise ValueError(f"Expected EPSG:4326, got {src.crs}")
            # read the first band
            predictions, _ = mask(src, [mapping(mask_polygon)], crop=True)

            # returns a boolean mask, True represents the polygons border
            border = raster_geometry_mask(
                src, [mapping(mask_polygon)], invert=True, crop=True
            )

        predictions, border = predictions[0], np.astype(border[0], np.int8)

        return predictions, border

    @staticmethod
    def create_plot(
        predictions: np.ndarray, border: np.ndarray, title: str
    ) -> go.Figure:
        """Plot the predictions and the border."""
        fig = go.Figure(
            go.Contour(
                z=border,
                showscale=False,
                contours=dict(start=0, end=1, size=1, coloring="lines"),
            )
        )
        fig.add_trace(
            go.Heatmap(z=predictions, zmin=0, zmax=1, colorscale="gray_r")
        )
        fig.update_layout(
            xaxis_showgrid=False,
            yaxis_showgrid=False,
            xaxis_visible=False,
            yaxis_visible=False,
            title=title,
        )
        return fig
