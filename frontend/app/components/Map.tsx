"use client";
import React, { useRef, useEffect } from "react";
import { LinearProgress, Select, MenuItem, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import L for fitBounds
import { BACKEND_API_BASE_URL } from "../../constants";

// Dynamically import MapContainer and TileLayer
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <LinearProgress />, // Show loading indicator while loading
  },
);

const DynamicTileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  },
);

const DynamicZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  {
    ssr: false,
  },
);

export default function ForecastMap({
  rasterPath,
  opacity,
  basemapUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
}: {
  rasterPath: string | null;
  opacity: number;
  basemapUrl: string;
}) {
  const mapRef = useRef<L.Map | null>(null); // Specify the type for mapRef
  // Initial map position (Innsbruck, Austria)
  const latitude = 47.2692;
  const longitude = 11.4041;
  const tilerUrl = `${BACKEND_API_BASE_URL}/tiles/{z}/{x}/{y}.png?tif=${encodeURIComponent(rasterPath)}`;
  const boundsUrl = `${BACKEND_API_BASE_URL}/bounds?tif=${encodeURIComponent(rasterPath)}`;

  // Custom hook to access map instance and fit bounds
  function FitBoundsToRaster() {
    const map = useMap();

    useEffect(() => {
      if (map) {
        console.log("Fetching bounds from:", boundsUrl);
        fetch(boundsUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("Bounds data:", data);
            if (data && data.bounds) {
              const b = data.bounds;
              // Leaflet bounds:
              // [[southWest_lat, southWest_lng], [northEast_lat, northEast_lng]]
              const leafletBounds: L.LatLngBoundsExpression = [
                [b[1], b[0]],
                [b[3], b[2]],
              ];
              map.fitBounds(leafletBounds);
            }
          });
      }
    }, [map, boundsUrl]); // Rerun if map or boundsUrl changes

    return null; // This component does not render anything
  }

  return (
    <DynamicMapContainer
      center={[latitude, longitude]}
      zoom={5} // Adjusted initial zoom, fitBounds will override
      maxZoom={10}
      minZoom={4}
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // Disable default zoom control
    >
      <DynamicTileLayer url={basemapUrl} maxZoom={10} />
      {rasterPath ? (
        <>
          <DynamicTileLayer
            url={tilerUrl}
            opacity={opacity}
            tileSize={256}
            maxZoom={10}
            minZoom={4}
          />
        </>
      ) : null}
      <FitBoundsToRaster />
      <DynamicZoomControl position="topright" />
    </DynamicMapContainer>
  );
}

export function BasemapSelector({
  baseMaps,
  selectedIndex = 0,
  onBasemapChange,
}: {
  baseMaps: Array<{ name: string; url: string }>;
  selectedIndex: number;
  onBasemapChange: (index: number) => void;
}) {
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
  ) => {
    const newIndex = event.target.value as number;
    onBasemapChange(newIndex);
  };

  return (
    <>
      <InputLabel id="basemap-label">Basemap</InputLabel>
      <Select
        labelId="basemap-label"
        id="basemap-selector"
        value={selectedIndex}
        label="Basemap"
        onChange={handleChange}
      >
        {baseMaps.map((basemap, index) => (
          <MenuItem key={basemap.name} value={index}>
            {basemap.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export const baseMaps = [
  {
    name: "carto-dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  },
  {
    name: "carto-light",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  },
  {
    name: "satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
];
