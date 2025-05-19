import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_API_BASE_URL } from "../../constants";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Stack,
} from "@mui/material";
import { Alert } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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
    <Grid container spacing={2}>
      <Grid>
        <Card
          variant="outlined"
          sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ArrowDownwardIcon color="success" />
              <Typography variant="h6" component="div">
                Minimum
              </Typography>
            </Stack>
            <Typography variant="h4" color="text.primary" fontWeight="bold">
              {typeof stats.min === "number"
                ? `${stats.min.toFixed(2)}`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Lowest landslide probability
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card
          variant="outlined"
          sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <ArrowUpwardIcon color="error" />
              <Typography variant="h6" component="div">
                Maximum
              </Typography>
            </Stack>
            <Typography variant="h4" color="text.primary" fontWeight="bold">
              {typeof stats.max === "number"
                ? `${stats.max.toFixed(2)}`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Highest landslide probability
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card
          variant="outlined"
          sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <PercentIcon color="primary" />
              <Typography variant="h6" component="div">
                Coverage
              </Typography>
            </Stack>
            <Typography variant="h4" color="text.primary" fontWeight="bold">
              {typeof stats.valid_percent === "number"
                ? `${stats.valid_percent.toFixed(2)}%`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Total global area with a forecast.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
