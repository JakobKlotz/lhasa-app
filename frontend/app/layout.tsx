"use client"; // Required for createTheme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Footer from "./components/Footer";
import Box from "@mui/material/Box";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>🛰 LHASA forecast</title>
        <meta name="description" content="Current landslide predictions" />
        <link rel="icon" href="/favicon.png" />
      </head>
      {/* Wrap the body content with ThemeProvider and CssBaseline */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </body>
      </ThemeProvider>
    </html>
  );
}
