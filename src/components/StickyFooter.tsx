import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function StickyFooter() {
  return (
          <Container maxWidth="sm" sx={{display:"flex",flexDirection:"row",gap:"10%",margin:"1%"}}>
            <Typography >
              <a href="https://www.linkedin.com/in/mart%C3%ADn-borba-l%C3%B3pez-923ba2180/">Linkedin profile</a>
            </Typography>
            <Typography >
              <a href="mailto:MBorba98@gmail.com">Email: Mborba98@gmail.com</a>
            </Typography>
            <Typography >
              Phone: +598 92935978
            </Typography>
            {/* <Copyright /> */}
          </Container>
  );
}