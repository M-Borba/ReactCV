import { useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, type ThemeOptions } from '@mui/material/styles';
import { deepPurple, grey, indigo } from '@mui/material/colors';
import './App.css';
import MBorba from './containers/MBorba/MBorba';
import StickyFooter from './components/StickyFooter';
import ColorModeButton from './components/ColorModeButton';

type PaletteMode = 'light' | 'dark';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      ...deepPurple,
      ...(mode === 'dark' && {
        main: indigo[200],
      }),
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: grey[900],
            paper: grey[800],
          },
        }
      : {
          background: {
            default: grey[50],
            paper: grey[100],
          },
        }),
    text:
      mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[700],
          }
        : {
            primary: '#fff',
            secondary: grey[400],
          },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
      marginBottom: '1.5rem',
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
});

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ColorModeButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} />
      <MBorba />
      <StickyFooter />
    </ThemeProvider>
  );
}

export default App;
