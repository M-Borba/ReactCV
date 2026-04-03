import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';
import Link from '@mui/material/Link';

const footerTextColor = '#e2e8f0';
const footerMutedColor = 'rgba(226,232,240,0.72)';
const footerAccentColor = '#5eead4';

export default function StickyFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 4,
        px: 2,
        background: 'linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(15,23,42,0.98) 100%)',
        borderTop: '1px solid rgba(148,163,184,0.14)',
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent', textAlign: 'center' }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 3, color: '#f8fafc', fontWeight: 500 }}>
            Get In Touch
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkedInIcon sx={{ color: '#0077B5', fontSize: 20 }} />
              <Link
                href="https://www.linkedin.com/in/mart%C3%ADn-borba-l%C3%B3pez-923ba2180/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: footerTextColor,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline', color: footerAccentColor },
                  fontSize: '0.95rem',
                }}
              >
                LinkedIn Profile
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#EA4335', fontSize: 20 }} />
              <Link
                href="mailto:MBorba98@gmail.com"
                sx={{
                  color: footerTextColor,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline', color: footerAccentColor },
                  fontSize: '0.95rem',
                }}
              >
                MBorba98@gmail.com
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
              <Typography sx={{ color: footerTextColor, fontSize: '0.95rem' }}>+598 92 935 978</Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.14)' }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              sx={{
                color: footerMutedColor,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              Copyright {currentYear} Martin Borba. Made with
              <FavoriteIcon sx={{ fontSize: 16, color: '#E91E63' }} />
              and
              <CodeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            </Typography>

            <Typography variant="body2" sx={{ color: footerMutedColor }}>
              Built with React + TypeScript + Material-UI
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
