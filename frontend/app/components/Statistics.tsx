import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_API_BASE_URL } from "../../constants";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Divider,
  Box,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface StatisticsProps {
  rasterPath: string;
  // rasterPath will be a string because the parent component ensures it
}

interface RasterStats {
  valid_percent: number;
  std: number;
  percentile_98: number;
}

export default function Statistics({ rasterPath }: StatisticsProps) {
  const [stats, setStats] = useState<RasterStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      setStats(null); // Clear previous stats
      try {
        const response = await axios.get(
          `${BACKEND_API_BASE_URL}/statistics?tif=${encodeURIComponent(rasterPath)}`,
        );
        console.log(`Fetched statistics for: ${rasterPath}`, response.data);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load statistics.");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [rasterPath]); // Re-run effect if rasterPath changes

  if (loading) {
    return (
      <Card>
        <CardContent style={{ textAlign: "center" }}>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert variant="outlined" severity="error">
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Alert variant="outlined" severity="info">
            No statistics available.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid>
        <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
          <Box sx={{ p: 3, backgroundColor: "primary.light", color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" fontWeight="500">
                Global Forecast Analytics
              </Typography>
              <Tooltip
                title={"Statistics are calculated from the global " +
                  "landslide hazard data. They provide insights into the " +
                  "distribution and variability of landslide probabilities " +
                  "worldwide."
                }
                arrow
                placement="right-end"
              >
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider />
          <Grid container>
            <Grid sx={{ p: 3, borderRight: "1px solid #eee" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  COVERAGE
                </Typography>
                <Tooltip
                  title={"Percentage of the global area that has landslide " +
                    "risk data available."
                  }
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h4" fontWeight="medium">
                {typeof stats.valid_percent === "number"
                  ? `${stats.valid_percent.toFixed(3)}%`
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid sx={{ p: 3, borderRight: "1px solid #eee" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  STANDARD DEVIATION
                </Typography>
                <Tooltip
                  title={
                    "Measures how spread out the landslide probability " +
                    "values are. Higher values indicate more extreme risk " +
                    "variations worldwide."
                  }
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                  <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="medium">
                  {typeof stats.std === "number"
                    ? `${stats.std.toFixed(3)}`
                    : "N/A"}
                </Typography>
                <EqualizerOutlinedIcon sx={{ ml: 1 }} />
              </Box>
            </Grid>
            <Grid sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  98% QUANTILE
                </Typography>
                <Tooltip
                  title={"The probability value below which 98% of all " +
                    "observations areas fall. This represents the upper " +
                    "extreme of landslide risk, excluding only the top 2% " +
                    "most extreme values."
                  }
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="medium">
                  {typeof stats.percentile_98 === "number"
                    ? `${stats.percentile_98.toFixed(3)}`
                    : "N/A"}
                </Typography>
                <TrendingUpIcon color="error" sx={{ ml: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
