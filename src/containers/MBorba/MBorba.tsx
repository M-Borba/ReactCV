

import './MBorba.css'
import GameCamComponent from '../../components/GameCam/GameCam';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Chat from '../../components/BertChat/Chat';
import { useState } from 'react';
function MBorba() {

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Martín Borba's personal page
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
          Hi, I'm a computer engineer from <a href="https://www.fing.edu.uy/" target="_blank">Fing UDELAR</a> . Currently, I work as a Fullstack developer, crafting web applications. While I enjoy being involved in every aspect of the application, I have a particular passion for backend development. 
          </Typography>
          {/* <Typography variant="h3" component="h1" gutterBottom>
            Background
          </Typography>
          <Typography variant="body1">Sticky footer placeholder.</Typography> */}
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme:any) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
        </Box>
      </Box>
      <h1>Martín Borba </h1>
      <div className="card">
          System Analist
        <p>
         
        </p>
        <p className="light-text">
          Here is a simple game demo implemented using pre-trained 
           <a href="https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/README.md" target="_blank"> face mesh model</a> from tensorflow.js, eat as much as you can under 30 seconds! 
        </p>
        <p className="light-text">Open your mouth to eat the falling food, and always face the camera forward for better detection</p>
      </div>
      <Chat/>
      <GameCamComponent /> 
    </div>
  )
}

export default MBorba


