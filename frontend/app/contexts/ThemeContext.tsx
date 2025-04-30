"use client";

import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";

// Define the shape of the context
interface ThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: "dark", // Default mode
});

// Define the props for the provider
interface AppThemeProviderProps {
  children: React.ReactNode;
}

// Create a provider component
export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>("dark"); // Default to dark

  // Effect to read saved mode from localStorage on initial client load
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode); // Save preference
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  // Create the theme based on the current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#C9CBA3" }, // Same primary color for both themes
          secondary: { main: "#E26D5C" }, // Same secondary color for both themes
          background: {
            default: mode === "light" ? "#ffffff" : "#121212",
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);
