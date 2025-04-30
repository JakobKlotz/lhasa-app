import ThemeSwitcher from "./ThemeSwitcher";
import { Box, Typography, Divider } from "@mui/material";
import BackendStatusIndicator from "./BackendStatusIndicator";
import TextHighlighter from "./TextHighlighter";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mx: 15 }}>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          🌍 LHASA Forecast
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Typography
          component="a"
          href="/about"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <TextHighlighter color="secondary" heightPercentage={40}>
            About
          </TextHighlighter>
        </Typography>
      </Box>

      <Box sx={{ mr: 15, display: "flex", alignItems: "center" }}>
        <BackendStatusIndicator />
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <ThemeSwitcher />
      </Box>
    </header>
  );
}
