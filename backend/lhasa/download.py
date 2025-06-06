from pathlib import Path

import httpx
import pandas as pd
from tqdm import tqdm


class Downloader:
    """
    Download file from the Nasa Landslide Hazard Assessment for
    Situational Awareness (LHASA) service.

    Args:
        base_url (str, optional): The base URL to download the tif files from.
            Default: https://maps.nccs.nasa.gov/download/landslides/latest/
    """

    def __init__(
        self,
        base_url: str = "https://maps.nccs.nasa.gov/download/landslides/latest/",  # noqa: E501
    ):
        self.base_url = base_url

    def download_tomorrow(self, folder: str | Path = "data") -> None:
        """Download only tomorrow.tif"""
        self._download_specific("tomorrow.tif", folder)

    def download_today(self, folder: str | Path = "data") -> None:
        """Download only today.tif"""
        self._download_specific("today.tif", folder)

    def _download_specific(self, tif_name: str, folder: str | Path) -> None:
        metadata = self.read_metadata(self.base_url)

        if not Path(folder).exists():
            Path(folder).mkdir(exist_ok=True)

        file_prefix = metadata[metadata["Name"] == tif_name][
            "File prefix"
        ].iloc[0]

        self.download_tif(
            url=f"{self.base_url}{tif_name}",
            path=f"{folder}/{file_prefix}_{tif_name}",
            verbose=True,
            overwrite=False,
        )

    @staticmethod
    def download_tif(
        url: str,
        path: str | Path,
        verbose: bool = True,
        overwrite: bool = False,
    ) -> None:
        """
        Download a tif file from the given url to the given path.

        Args:
            url (str): The URL to download the tif file from.
            path (str | Path): The path to save the downloaded tif file.
            verbose (bool, optional): Print a message after downloading.
            overwrite (bool, optional): If True, overwrite the file.

        Raises:
            FileExistsError: If the file already exists and overwrite is False.
        """
        path = Path(path)
        if path.exists() and not overwrite:
            raise FileExistsError(
                f"File {path} already exists. Use overwrite=True to "
                f"overwrite it."
            )

        with httpx.stream("GET", url) as response:
            response.raise_for_status()
            total = int(response.headers.get("content-length", 0))
            with (
                path.open("wb") as f,
                tqdm(
                    total=total,
                    unit="iB",
                    unit_scale=True,
                    unit_divisor=1024,
                    desc=path.name,
                ) as pbar,
            ):
                for chunk in response.iter_bytes():
                    size = f.write(chunk)
                    pbar.update(size)

        if verbose:
            print(f"Downloaded {url} to {path}")

    @staticmethod
    def read_metadata(
        url: str = "https://maps.nccs.nasa.gov/download/landslides/latest/",
    ) -> pd.DataFrame:
        """
        Read metadata from the latest predictions URL
        (https://maps.nccs.nasa.gov/download/landslides/latest/).

        Args:
            url (str): The URL to read the metadata from.

        Returns:
            pd.DataFrame: The metadata as a pandas DataFrame.
        """
        data = pd.read_html(url)
        # get the first table (only one)
        data = data[0][["Name", "Last modified", "Size"]]

        # prepare datetime
        data["Last modified"] = pd.to_datetime(
            data["Last modified"], format="%Y-%m-%d %H:%M"
        )
        # prepare file prefix
        data["File prefix"] = (
            data["Last modified"]
            .astype(str)
            .str.replace(" ", "T")
            .str.replace(":", "-")
        )

        return data.dropna(subset="Name")

    @staticmethod
    def get_latest_date(
        url: str = "https://maps.nccs.nasa.gov/download/landslides/latest/",
    ) -> str:
        """
        Get the latest file date available.

        Args:
            url (str): The URL to read the metadata from.

        Returns:
            str: The latest file date as a string.
        """
        data = Downloader.read_metadata(url)
        # read uploaded date from tomorrow.tif file (just a choice)
        # Note: the upload for all files occurs at the same time
        data = data[data["Name"] == "tomorrow.tif"]

        return data["File prefix"].iloc[0]
