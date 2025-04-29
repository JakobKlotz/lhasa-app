'use client'; // Required for createTheme
import { Inter } from "next/font/google";
import { PublicEnvScript } from "next-runtime-env";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

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
          {/* <PublicEnvScript /> */}
        <link rel="icon" href="/favicon.png" />
      </head>
      {/* Wrap the body content with ThemeProvider and CssBaseline */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
