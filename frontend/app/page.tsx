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

import { fetchCountries } from "./api/countries";
import { fetchForecast } from "./api/forecast";
import { downloadData } from "./api/download";
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
  const [selectedCountry, setSelectedCountry] = useState(null); // State for the selected country object

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
        // Find and set the default country after fetching
        const defaultCountry = fetchedCountries.find(
          (country) => country.code === "AT",
        );
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setNutsId(defaultCountry.code); // Set initial nutsId as well
        }
      } catch (err) {
        setError("Error fetching countries data");
      }
    };
    loadCountries();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleForecast = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchForecast(nutsId);
      setPlotData(data);
    } catch (err) {
      setError("Error fetching forecast data");
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ display: "flex", gap: 2, mt: 2 }}>
        {/* Left Paper for Controls */}
        <Paper elevation={1} sx={{ p: 2, width: "auto" }}>
          {" "}
          {/* Adjust width as needed */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // Stack controls vertically
              alignItems: "stretch", // Stretch items to fill width
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
                setSelectedCountry(value); // Update selected country object
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
                      autoComplete: "new-password", // disable autocomplete and autofill
                    },
                  }}
                />
              )}
            />

            <Typography variant="caption" sx={{ mt: 1, mb: -3 }}>
              Creation date of forecast
            </Typography>
            <DateCalendar />

            <Button
              variant="contained"
              onClick={handleDownload}
              disabled={true}
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
              disabled={!nutsId || loading}
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
          sx={{ p: 1, flex: 1, height: "calc(100vh - 250px)" }} // Use flex: 1 to take remaining space, adjust height as needed
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
                  Select a country to get started
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
