import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import MBorba from './containers/MBorba/MBorba'
import StickyFooter from './components/StickyFooter'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ColorModeButton from './components/ColorModeButton';
import { deepPurple,indigo, grey } from '@mui/material/colors';
import { useMemo, useState } from 'react';

const getDesignTokens = (mode: string):any => ({
  palette: {
    mode,
    primary: {
      ...deepPurple,
      ...(mode === 'dark' && {
        main: indigo[200],
      }),
    },
    ...(mode === 'dark' && {
      background: {
        default: grey[900],
        paper: grey[900],
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[800],
          }
        : {
            primary: '#fff',
            secondary: grey[500],
          }),
    },
  },
});




function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode?'dark':'light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

   return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <ColorModeButton onClick={()=> setMode(mode == 'light'? 'dark':'light') }/>
      <MBorba/>
      <StickyFooter/>
    </ThemeProvider>
  );
}

export default App


