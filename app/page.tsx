// app/page.tsx
'use client';

import { useState } from 'react';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {
  Button,
  TextField,
  Box,
  Container,
  Alert,
  CircularProgress,
  Paper,
  LinearProgress,
  Chip,
  CssBaseline
} from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#FF5733',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#47008F',
    },
  },
});

export default function Home() {
  const [nutsId, setNutsId] = useState('');
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:8000/forecast/${nutsId}`);
      setPlotData(response.data);
    } catch (err) {
      setError('Error fetching forecast data');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4, justifyContent: "center"}}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <h1>LHASA forecast</h1>
          </Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ 
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              }}>
              
            <TextField sx={{ color: "primary" }}
                fullWidth
                variant="outlined"
                value={nutsId}
                onChange={(e) => setNutsId(e.target.value)}
                label="Enter a Country Code"
                disabled={loading}
                size="small"
              />
              <Button
                variant="contained"
                onClick={fetchForecast}
                disabled={!nutsId || loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Loading...' : 'Fetch Forecast'}
              </Button>
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {loading && <LinearProgress />}
          {plotData && (
            <Paper elevation={3}>
              <Plot
                data={plotData.data}
                layout={plotData.layout}
                config={plotData.config}
                style={{ width: '100%', height: '600px' }}
              />
            </Paper>
          )}
        </Box>
      
        <Box
          component="footer"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
            py: 3,
            borderTop: '1px solid #e0e0e0',
            position: 'fixed',
            bottom: 20,
            width: '65%',
            gap: 2
          }}
        >
          {/* <Avatar 
            alt="Jakob Klotz" 
            src="https://avatars.githubusercontent.com/u/177755923?v=4"
          /> */}

          <Chip
            icon={<GitHub />}
            label="GitHub"
            variant="outlined"
            clickable
            component="a"
            href="https://github.com/JakobKlotz"
            target="_blank"
          />

          <Chip
            icon={<DescriptionIcon />}
            label="License"
            variant="outlined"
            clickable
            component="a"
            href="https://github.com/nasa/LHASA/blob/master/LICENSE.pdf"
            target="_blank"
          />
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
