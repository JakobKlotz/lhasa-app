"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import {
  Button,
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Alert,
  Slider,
  InputLabel,
} from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import dayjs, { Dayjs } from "dayjs";

import { fetchAvailableFiles, AvailableFilesResponse } from "./api/files";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import ForecastMap, { BasemapSelector, baseMaps } from "./components/Map";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import TuneIcon from "@mui/icons-material/Tune";
import LayersIcon from "@mui/icons-material/Layers";
import OpacityIcon from "@mui/icons-material/Opacity";
import Popover from "@mui/material/Popover";
import MapLegend from "./components/MapLegend";

// marks for the slider
const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 100,
    label: "100%",
  },
];

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [availableFiles, setAvailableFiles] =
    useState<AvailableFilesResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [tifFilename, setTifFilename] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(0.55);
  const [selectedBasemapIndex, setSelectedBasemapIndex] = useState(() => {
    // Initialize based on theme or default
    const initialMode =
      typeof window !== "undefined"
        ? localStorage.getItem("themeMode")
        : "dark";
    return initialMode === "light"
      ? baseMaps.findIndex((bm) => bm.name === "carto-light")
      : baseMaps.findIndex((bm) => bm.name === "carto-dark");
  });
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const handleSpeedDialClose = () => {
    setOpenSpeedDial(false);
  };

  const handleSpeedDialOpen = () => {
    setOpenSpeedDial(true);
  };

  const handleControlClick = (
    event: React.MouseEvent<HTMLElement>,
    control: string,
  ) => {
    setAnchorEl(event.currentTarget as HTMLElement);
    setActiveControl(control);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setActiveControl(null);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch available files data
        const filesData = await fetchAvailableFiles();
        setAvailableFiles(filesData);

        // Load the latest available TIF file on startup
        if (filesData && Object.keys(filesData).length > 0) {
          const availableDates = Object.keys(filesData).sort(
            (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf(),
          );
          const latestDateString = availableDates[0];
          const latestFileInfo = filesData[latestDateString];

          if (latestFileInfo) {
            setSelectedDate(dayjs(latestDateString));
            setTifFilename(latestFileInfo.file_name);
          }
        }
      } catch (err) {
        setError("Error fetching initial data");
      }
    };
    loadInitialData();
  }, []);

  const handleTif = async () => {
    // Ensure a date is selected and file data is available
    if (!selectedDate || !availableFiles) {
      setError("Please select an available date.");
      setTifFilename(null);
      return;
    }

    const dateString = selectedDate.format("YYYY-MM-DD");
    const fileInfo = availableFiles[dateString];

    if (!fileInfo) {
      setError("Selected date does not have corresponding file data.");
      setTifFilename(null);
      return;
    }

    setTifFilename(fileInfo.file_name); // Get the filename
    setError(null); // Clear any previous error
  };

  const shouldDisableDate = (date: dayjs.Dayjs) => {
    // Don't disable if file data hasn't loaded yet
    if (!availableFiles) return false;
    const dateString = date.format("YYYY-MM-DD");
    // Disable if the date string is NOT a key in the availableFiles object
    return !availableFiles.hasOwnProperty(dateString);
  };

  const handleBasemapChange = (index: number) => {
    setSelectedBasemapIndex(index);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", gap: 2, mt: 2, height: "80vh", width: "100%" }}
      >
        {/* Left Paper for Controls */}
        <Paper elevation={1} sx={{ p: 2, width: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 2,
            }}
          >
            <Typography variant="h6">Landslide Forecasting</Typography>
            <Divider />

            <Typography variant="caption" sx={{ mt: 1, mb: -3 }}>
              Creation date of forecast
            </Typography>

            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              shouldDisableDate={shouldDisableDate}
            />

            <Button
              variant="contained"
              onClick={handleTif}
              // Disable if no date selected
              disabled={!selectedDate}
              startIcon={<PlayArrowOutlinedIcon />}
            >
              Display Forecast
            </Button>
          </Box>
        </Paper>
        {/* Right Paper for Plot/Map */}
        <Paper
          elevation={3}
          sx={{ p: 1, flex: 1, height: "100%", position: "relative" }}
        >
          {error && (
            <Box>
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            </Box>
          )}
          {/* Shows simply the BaseMap if tifFilename is null */}
          <ForecastMap
            rasterPath={tifFilename}
            opacity={opacity}
            basemapUrl={baseMaps[selectedBasemapIndex].url}
          />
          <MapLegend />

          {/* SpeedDial Box for Map Customization */}
          <Box
            sx={{ position: "absolute", zIndex: 1000, left: 16, bottom: 16 }}
          >
            <SpeedDial
              ariaLabel="Map customization options"
              icon={<SpeedDialIcon icon={<TuneIcon />} />}
              onClose={handleSpeedDialClose}
              onOpen={handleSpeedDialOpen}
              open={openSpeedDial}
              direction="up"
            >
              <SpeedDialAction
                key="opacity"
                icon={<OpacityIcon />}
                onClick={(e) => handleControlClick(e, "opacity")}
              />
              <SpeedDialAction
                key="basemap"
                icon={<LayersIcon />}
                onClick={(e) => handleControlClick(e, "basemap")}
              />
            </SpeedDial>
          </Box>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {activeControl === "opacity" && (
              <Box sx={{ p: 2, mx: 2, width: "7vw" }}>
                <InputLabel id="opacity-label">Opacity</InputLabel>
                <Slider
                  size="medium"
                  defaultValue={55}
                  aria-label="Opacity"
                  marks={marks}
                  sx={{ width: "90%", mx: "auto" }}
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) => {
                    const newOpacity = (newValue as number) / 100;
                    setOpacity(newOpacity);
                  }}
                />
              </Box>
            )}

            {activeControl === "basemap" && (
              <Box sx={{ flex: 1, p: 2, mx: 2 }}>
                <BasemapSelector
                  baseMaps={baseMaps}
                  selectedIndex={selectedBasemapIndex}
                  onBasemapChange={(index) => {
                    handleBasemapChange(index);
                    handlePopoverClose();
                  }}
                />
              </Box>
            )}
          </Popover>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
