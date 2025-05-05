"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import dynamic from "next/dynamic";
import {
  Button,
  TextField,
  Box,
  Container,
  Alert,
  CircularProgress,
  Paper,
  LinearProgress,
  Typography,
  Divider,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import dayjs, { Dayjs } from "dayjs";

import { fetchCountries } from "./api/countries";
import { fetchForecast } from "./api/forecast";
import { downloadData } from "./api/download";
import { fetchAvailableFiles, AvailableFilesResponse } from "./api/files";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import TextHighlighter from "./components/TextHighlighter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: true,
  loading: () => <CircularProgress />,
}) as any;

export default function Home() {
  const [nutsId, setNutsId] = useState("");
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [availableFiles, setAvailableFiles] =
    useState<AvailableFilesResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch countries
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
        const defaultCountry = fetchedCountries.find(
          (country) => country.code === "AT",
        );
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setNutsId(defaultCountry.code);
        }

        // Fetch available files data
        const filesData = await fetchAvailableFiles();
        setAvailableFiles(filesData);
      } catch (err) {
        setError("Error fetching initial data");
        console.error(err);
      }
    };
    loadInitialData();
  }, []);

  const handleForecast = async () => {
    // Ensure a date is selected and file data is available
    if (!selectedDate || !availableFiles) {
      setError("Please select an available date.");
      return;
    }

    const dateString = selectedDate.format("YYYY-MM-DD");
    const fileInfo = availableFiles[dateString];

    if (!fileInfo) {
      setError("Selected date does not have corresponding file data.");
      console.error(
        "No file info found for date:",
        dateString,
        "in",
        availableFiles,
      );
      return;
    }

    const tifFilename = fileInfo.file_name; // Get the filename

    try {
      setLoading(true);
      setError("");
      // Pass nutsId and the tif filename
      const data = await fetchForecast(nutsId, tifFilename);
      setPlotData(data);
    } catch (err) {
      setError("Error fetching forecast data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadData();
    } catch (err) {
      setError("Error downloading data");
    } finally {
      setDownloading(false);
    }
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
      <Container maxWidth="xl" sx={{ display: "flex", gap: 2, mt: 2 }}>
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
            <Typography variant="h6">Forecasting</Typography>
            <Divider />

            {/* taken from https://mui.com/material-ui/react-autocomplete/#country-select */}
            <Autocomplete
              id="country-select-demo"
              value={selectedCountry}
              options={countries}
              sx={{ mt: 1 }}
              autoHighlight
              getOptionLabel={(option) => option.label}
              onChange={(e, value) => {
                setSelectedCountry(value);
                setNutsId(value?.code);
              }}
              size="medium"
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    />
                    {option.label} ({option.code})
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a country"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                      autoComplete: "new-password",
                    },
                  }}
                />
              )}
            />

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
              onClick={handleDownload}
              disabled={true} // TODO
            >
              {downloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Manual Data Download"
              )}
            </Button>

            <Button
              variant="contained"
              onClick={handleForecast}
              // Disable if no country, no date selected, or already loading
              disabled={!nutsId || !selectedDate || loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                </>
              ) : (
                <>
                  <PlayArrowOutlinedIcon color="secondary" />
                </>
              )}
            </Button>
          </Box>
        </Paper>
        {/* Right Paper for Plot/Map */}
        <Paper
          elevation={3}
          sx={{ p: 1, flex: 1, height: "calc(100vh - 250px)" }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {loading && <LinearProgress />}
          {!plotData && !loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%", // Ensure the centering box takes up the full space
              }}
            >
              <TravelExploreOutlinedIcon
                sx={{
                  fontSize: "3rem",
                  color: "primary.main",
                  mr: 2,
                }}
              />
              <TextHighlighter
                color="secondary"
                heightPercentage={65}
                borderRadius={5}
              >
                <Typography variant="h6">
                  Select a country and date to get started
                </Typography>
              </TextHighlighter>
            </Box>
          )}
          {plotData && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
                <Plot
                  data={plotData.data}
                  layout={plotData.layout}
                  config={plotData.config}
                  useResizeHandler={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
