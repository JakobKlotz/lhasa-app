import math
from pathlib import Path

import geopandas as gpd
import numpy as np
import plotly.graph_objects as go
import rasterio
from rasterio.mask import mask, raster_geometry_mask
from shapely import MultiPolygon, Polygon
from shapely.geometry import mapping


def read_nuts(nuts_path: str | Path) -> gpd.GeoDataFrame:
    """Read NUTS geojson file."""
    return gpd.read_file(nuts_path)


class ForeCast:
    def __init__(self, *, tif_path: str | Path, nuts: gpd.GeoDataFrame):
        """Visualize LHASA predictions for a given NUTS region.
        NUTS regions can be downloaded from:
        https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics

        Args:
            tif_path (str | Path): Tif file with predictions.
            nuts_path (str | Path): The path to the NUTS geojson file.
        """
        self.tif_path = Path(tif_path)
        self.nuts = nuts

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
                colorscale=[[0, "white"], [1, "black"]],
                line=dict(width=2),
            )
        )
        fig.add_trace(
            go.Heatmap(
                z=predictions,
                zmin=0,
                zmax=1,
                colorscale=[
                    [0, "#000000"],  # black for -9999/None
                    [0.000001, "rgb(0,104,55)"],  # green
                    [0.5, "rgb(255,255,0)"],  # yellow
                    [1, "rgb(165,0,38)"],  # red
                ],
                colorbar=dict(title="Probability"),
                zmid=0.5,
                hovertemplate="Probability: %{z}<extra></extra>",
            )
        )

        # scale the plot size
        height, width = predictions.shape
        scale_factor = 1.5
        # can't exceed 1000x600
        width, height = (
            min(width / scale_factor, 1_000),
            min(height / scale_factor, 600),
        )
        width, height = math.floor(width), math.floor(height)
        # must have at least 400x400
        width, height = max(width, 400), max(height, 400)

        print(width, height)
        fig.update_layout(
            xaxis_showgrid=False,
            yaxis_showgrid=False,
            xaxis_visible=False,
            yaxis_visible=False,
            title=title,
            plot_bgcolor="black",
            paper_bgcolor="black",
            font=dict(color="white"),
            autosize=False,
            width=width,
            height=width,
        )
        return fig
