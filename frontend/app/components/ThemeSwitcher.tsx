"use client";

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { useThemeContext } from "../contexts/ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {mode === "dark" ? <WbSunnyOutlinedIcon /> : <BedtimeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher;
