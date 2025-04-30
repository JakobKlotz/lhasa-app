import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import React from "react";

interface TextHighlighterProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | string; // Allow theme colors or custom CSS color
  heightPercentage?: number; // Control the highlight height
}

export default function TextHighlighter({
  children,
  color = "secondary",
  heightPercentage = 65,
}: TextHighlighterProps) {
  const theme = useTheme();

  // Resolve theme color string or use custom color
  const highlightColor =
    color === "primary"
      ? theme.palette.primary.main
      : color === "secondary"
        ? theme.palette.secondary.main
        : color;

  return (
    <Box
      component="span"
      sx={{
        background: `linear-gradient(to top, ${highlightColor} ${heightPercentage}%, transparent ${heightPercentage}%)`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        fontWeight: "bold",
        px: 0.2,
        borderRadius: "1px",
      }}
    >
      {children}
    </Box>
  );
}
