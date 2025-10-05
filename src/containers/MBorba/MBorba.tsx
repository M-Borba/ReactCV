

import './MBorba.css';
import GameCamComponent from '../../components/GameCam/GameCam';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import ScienceIcon from '@mui/icons-material/Science';
import Button from '@mui/material/Button';
import Chat from '../../components/BertChat/Chat';
import CIDetectionCam from '../../components/CICam/CIDetectionCam.jsx';

function MBorba() {
  const onDownloadScholarship = () => {
    const link = document.createElement('a');
    link.download = 'MBorba_scholarship.pdf';
    link.href = '/ReporteEscolaridadEgreso.pdf';
    link.click();
  };

  const onDownloadCV = () => {
    const link = document.createElement('a');
    link.download = 'MBorba_CV.pdf';
    link.href = '/Martín Borba López CV.pdf';
    link.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Hero Section */}
      <Container component="main" sx={{ mt: 6, mb: 4 }} maxWidth="lg">
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            mb: 4 
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ textAlign: 'center', color: 'text.primary' }}
          >
            Martín Borba
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary', 
              mb: 3,
              fontSize: '1.1rem' 
            }}
          >
            Computer Engineer & Full-Stack Developer
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto',
              mb: 4,
              lineHeight: 1.6
            }}
          >
            Hi! I'm a computer engineer from{' '}
            <a 
              href="https://www.fing.edu.uy/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', fontWeight: 'bold' }}
            >
              FING UDELAR
            </a>
            . Currently, I work as a full-stack developer, crafting web applications.
            While I enjoy being involved in every aspect of development, 
            I have a particular passion for backend architecture and system design.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button 
              onClick={onDownloadScholarship} 
              variant="contained" 
              color="primary"
              startIcon={<DownloadIcon />}
              endIcon={<DescriptionIcon />}
              sx={{ minWidth: 180 }}
            >
              Scholarship
            </Button>
            <Button 
              onClick={onDownloadCV} 
              variant="contained" 
              color="primary"
              startIcon={<DownloadIcon />}
              endIcon={<ContactPageIcon />}
              sx={{ minWidth: 180 }}
            >
              Resume
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* ML Demos Section */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <ScienceIcon sx={{ fontSize: 'inherit' }} />
          Machine Learning Demos
        </Typography>

        {/* Face Mesh Game */}
        <Paper 
          elevation={1} 
          sx={{ p: 3, mb: 4, backgroundColor: 'background.paper', borderRadius: 2 }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2 }}>
            🎮 Face Mesh Game
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
          >
            An interactive game built with TensorFlow.js using a pre-trained{' '}
            <a 
              href="https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/README.md" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', fontWeight: 'bold' }}
            >
              face mesh model
            </a>
            . Eat as much food as you can in 30 seconds!
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mb: 3, color: 'text.secondary', fontStyle: 'italic' }}
          >
            💡 Tip: Open your mouth to eat the falling food, and keep your face forward for better detection.
          </Typography>
          <GameCamComponent />
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* AI Chat Section */}
        <Paper 
          elevation={1} 
          sx={{ p: 3, mb: 4, backgroundColor: 'background.paper', borderRadius: 2 }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2 }}>
            💬 AI Assistant
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}
          >
            Ask me anything! This LLM-powered chatbot can answer questions about my background, 
            experience, and projects.
          </Typography>
          <Chat />
        </Paper>

        {/* Additional Demo */}
        <Paper 
          elevation={1} 
          sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2 }}>
            🔍 Computer Vision Detection
          </Typography>
          <CIDetectionCam />
        </Paper>
      </Container>
    </Box>
  );
}

export default MBorba



