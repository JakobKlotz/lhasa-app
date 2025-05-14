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
} from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import dayjs, { Dayjs } from "dayjs";

import { fetchAvailableFiles, AvailableFilesResponse } from "./api/files";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import ForecastMap from "./components/Map";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [availableFiles, setAvailableFiles] =
    useState<AvailableFilesResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [tifFilename, setTifFilename] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch available files data
        const filesData = await fetchAvailableFiles();
        setAvailableFiles(filesData);
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
        <Paper elevation={3} sx={{ p: 1, flex: 1, height: "100%" }}>
          {error && (
            <Box>
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            </Box>
          )}
          {/* Shows simply the BaseMap if tifFilename is null */}
          <ForecastMap rasterPath={tifFilename} />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
