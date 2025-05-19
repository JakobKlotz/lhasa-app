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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from "@mui/material";
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
import Statistics from "./components/Statistics";
import BarChartIcon from "@mui/icons-material/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
  const [activeDate, setActiveDate] = useState<Dayjs | null>(null); // Track currently displayed date
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
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);

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
            const latestDayjs = dayjs(latestDateString);
            setSelectedDate(latestDayjs);
            setActiveDate(latestDayjs);
            setTifFilename(latestFileInfo.file_name);
          }
        }
      } catch (err) {
        setError("Error fetching initial data");
      }
    };
    loadInitialData();
  }, []);

  // Handle date selection and auto-update map
  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate && availableFiles) {
      const dateString = newDate.format("YYYY-MM-DD");
      const fileInfo = availableFiles[dateString];

      if (fileInfo) {
        setTifFilename(fileInfo.file_name);
        setActiveDate(newDate);
        setError(null);
      }
    }
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
            <Typography variant="caption" sx={{ mt: 1, mb: -3 }}>
              Creation date of forecast
            </Typography>

            <DateCalendar
              sx={{ mb: -3 }}
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
            />

            <Divider />

            {tifFilename && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Forecast Analysis
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<BarChartIcon />}
                    onClick={() => setStatsDialogOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    View Statistics
                  </Button>

                  <Dialog
                    sx={{ p: 2 }}
                    open={statsDialogOpen}
                    onClose={() => setStatsDialogOpen(false)}
                  >
                    <DialogTitle
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <BarChartIcon sx={{ mr: 1 }} />
                      Selected: {activeDate?.format("DD-MM-YYYY")}
                      <IconButton
                        aria-label="close"
                        onClick={() => setStatsDialogOpen(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                      {/* Actual statistics presented as info cards */}
                      <Statistics rasterPath={tifFilename} />
                    </DialogContent>
                  </Dialog>
                </Box>
              </>
            )}
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

          {/* Display selected date as chip */}
          {activeDate && (
            <Chip
              sx={{
                position: "absolute",
                top: 15,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                mb: 1,
              }}
              icon={<CalendarTodayIcon />}
              color="secondary"
              label={`Selected: ${activeDate.format("DD-MM-YYYY")}`}
            />
          )}

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
