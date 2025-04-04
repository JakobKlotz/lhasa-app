// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  Chip,
  CssBaseline,
  Tooltip,
  IconButton,
} from "@mui/material";
import GitHub from "@mui/icons-material/GitHub";
import DescriptionIcon from "@mui/icons-material/Description";
import Autocomplete from "@mui/material/Autocomplete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoIcon from "@mui/icons-material/Info";

import { fetchCountries } from "./api/countries";
import { fetchForecast } from "./api/forecast";
import { downloadData } from "./api/download";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: true,
  loading: () => <CircularProgress />,
}) as any;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ce93d8",
    },
    secondary: {
      main: "#E0C2FF",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});

export default function Home() {
  const [nutsId, setNutsId] = useState("");
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countries = await fetchCountries();
        setCountries(countries);
      } catch (err) {
        setError("Error fetching countries data");
      }
    };
    loadCountries();
  }, []);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 1, justifyContent: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <h1>🌏 LHASA forecast</h1>
            <Tooltip
              title="Visualize landslide forecast data from NASA. 
                Select a country to view the forecast. This app solely aims to 
                provide a simple visual interface for LHASA predictions."
            >
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button variant="contained" onClick={handleDownload}>
                {downloading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Download latest data"
                )}
              </Button>

              {/* taken from https://mui.com/material-ui/react-autocomplete/#country-select */}
              <Autocomplete
                id="country-select-demo"
                sx={{ width: 400 }}
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                onChange={(e, value) => setNutsId(value?.code)}
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
                    <PlayArrowIcon />
                    Run
                  </>
                )}
              </Button>
            </Box>
          </Paper>
        </Box>

        <Paper
          elevation={3}
          sx={{ p: 1, mb: 1, width: "100%", height: "620px" }}
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
                height: "100%",
              }}
            >
              Select a country first
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

        <Paper elevation={1} sx={{ p: 0, mb: 1 }}>
          <Box
            component="footer"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              py: 2,
              bottom: 0,
              gap: 2,
            }}
          >
            <Chip
              icon={<GitHub />}
              label="GitHub"
              variant="outlined"
              clickable
              component="a"
              href="https://github.com/JakobKlotz/lhasa-app"
              target="_blank"
            />

            <Chip
              icon={<InfoIcon />}
              label="Nasa LHASA"
              variant="outlined"
              clickable
              component="a"
              href="https://github.com/nasa/lhasa"
              target="_blank"
            />

            <Chip
              icon={<DescriptionIcon />}
              label="License"
              variant="outlined"
              clickable
              component="a"
              href="https://github.com/nasa/LHASA/blob/master/LICENSE.pdf"
              target="_blank"
            />
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
