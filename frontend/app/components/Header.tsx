import ThemeSwitcher from "./ThemeSwitcher";
import { Box, Typography, Divider } from "@mui/material";

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
      <Box sx={{ display: "flex", alignItems: "center", mx: 15}}>
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
          About
        </Typography>
      </Box>

      <Box sx={{ mr: 15 }}>
        <ThemeSwitcher />
      </Box>
    </header>
  );
}
