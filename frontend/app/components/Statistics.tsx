import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_API_BASE_URL } from "../../constants";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Alert } from "@mui/material";


interface StatisticsProps {
  rasterPath: string;
  // rasterPath will be a string because the parent component ensures it
}

interface RasterStats {
  valid_percent: number;
  // TODO add other stats
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
          <LinearProgress/>
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
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Total Coverage (%)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Check if valid_percent exists before trying to display it */}
          {typeof stats.valid_percent === "number"
            ? `${stats.valid_percent.toFixed(2)}%`
            : "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
}
