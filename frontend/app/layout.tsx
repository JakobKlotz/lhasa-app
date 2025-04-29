"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import { AppThemeProvider } from "./contexts/ThemeContext";

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
      {/* Wrap the body content with the new AppThemeProvider */}
      <AppThemeProvider>
        {/* CssBaseline is now handled inside AppThemeProvider */}
        <body>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </body>
      </AppThemeProvider>
    </html>
  );
}
