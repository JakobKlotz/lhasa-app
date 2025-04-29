import ThemeSwitcher from "./ThemeSwitcher";
import { Box, Typography } from "@mui/material";

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
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
        <Typography
          component="a"
          href="/about"
          sx={{
            ml: 2,
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

      <Box>
        <ThemeSwitcher />
      </Box>
    </header>
  );
}
