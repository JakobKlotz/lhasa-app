"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { BACKEND_API_BASE_URL } from "../../constants";

type BackendStatus = "checking" | "online" | "offline";

export default function BackendStatusIndicator() {
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>("checking");

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/`);
        setBackendStatus(response.status === 200 ? "online" : "offline");
      } catch (err) {
        setBackendStatus("offline");
      }
    };
    checkBackendStatus();
    // Set up interval to check status every 5 minutes
    const intervalId = setInterval(checkBackendStatus, 5 * 60 * 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = () => {
    switch (backendStatus) {
      case "online":
        return "success";
      case "offline":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Chip
      avatar={<CircleOutlinedIcon sx={{ fontSize: 14 }} />}
      label={`Systems | ${backendStatus}`}
      variant="outlined"
      size="small"
      color={getStatusColor()} // Use the color from the status info
    />
  );
}
