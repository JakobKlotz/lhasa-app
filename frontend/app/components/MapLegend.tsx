"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface LegendItem {
  color: string;
  label: string;
  valueRange: string;
}

// Define the colormap based on the backend configuration
const colormapData: LegendItem[] = [
  {
    color: "rgba(201, 242, 155, 1)",
    label: "Very Low",
    valueRange: "0.0 - 0.25",
  },
  { color: "rgba(255, 255, 153, 1)", label: "Low", valueRange: "0.25 - 0.5" },
  {
    color: "rgba(255, 140, 0, 1)",
    label: "Moderate",
    valueRange: "0.5 - 0.75",
  },
  { color: "rgba(217, 30, 24, 1)", label: "High", valueRange: "0.75 - 1.0" },
];

export default function MapLegend() {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        position: "absolute",
        bottom: 30,
        right: 10,
        zIndex: 1000, // Ensure it's above the map
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Landslide Hazard Probability
      </Typography>
      {colormapData.map((item) => (
        <Box
          key={item.label}
          sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: item.color,
              mr: 1,
              border: "1px solid #ccc",
            }}
          />
          <Typography variant="caption">
            {item.label} ({item.valueRange})
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}
