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
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface StatisticsProps {
  rasterPath: string;
  // rasterPath will be a string because the parent component ensures it
}

interface RasterStats {
  valid_percent: number;
  min: number;
  max: number;
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
            <Typography variant="h5" fontWeight="500">
              Global Forecast Analytics
            </Typography>
          </Box>
          <Divider />
          <Grid container>
            <Grid sx={{ p: 3, borderRight: "1px solid #eee" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                COVERAGE
              </Typography>
              <Typography variant="h4" fontWeight="medium">
                {typeof stats.valid_percent === "number"
                  ? `${stats.valid_percent.toFixed(2)}%`
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid sx={{ p: 3, borderRight: "1px solid #eee" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                MIN PROBABILITY
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="medium">
                  {typeof stats.min === "number"
                    ? `${stats.min.toFixed(2)}`
                    : "N/A"}
                </Typography>
                <TrendingDownIcon color="success" sx={{ ml: 1 }} />
              </Box>
            </Grid>
            <Grid sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                MAX PROBABILITY
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="medium">
                  {typeof stats.max === "number"
                    ? `${stats.max.toFixed(2)}`
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
