import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import MBorba from './containers/MBorba/MBorba'
import StickyFooter from './components/StickyFooter'
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
const defaultTheme = createTheme();
   return (
      <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <MBorba/>
      <StickyFooter/>
    </ThemeProvider>
  );
}

export default App
