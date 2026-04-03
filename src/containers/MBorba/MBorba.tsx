import './MBorba.css';
import type { ComponentType, ReactElement } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import ScienceIcon from '@mui/icons-material/Science';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeferredRender from '../../components/DeferredRender';

const loadGameCam = () => import('../../components/GameCam/GameCam');
const loadChat = () => import('../../components/BertChat/Chat');
const loadCIDetectionCam = () => import('../../components/CICam/CIDetectionCam.jsx');

type DemoDefinition = {
  title: string;
  icon: ReactElement;
  summary: string;
  whyBuilt: string[];
  tech: string[];
  githubUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  loadingLabel: string;
  minHeight: number;
  loader: () => Promise<{ default: ComponentType }>;
};

const recruiterStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'TensorFlow.js',
  'Transformers.js',
  'Python',
  'PostgreSQL',
];

const recruiterSignals = [
  'Full-stack product delivery',
  'In-browser ML prototypes',
  'API and system design',
];

const demos: DemoDefinition[] = [
  {
    title: 'Face Mesh Interaction Demo',
    icon: <SportsEsportsIcon fontSize="small" />,
    summary:
      'Browser game driven by facial landmark detection. It shows I can turn computer vision primitives into a playful, production-style interaction.',
    whyBuilt: [
      'Built to prove that real-time inference in the browser can feel responsive enough for consumer-facing UX.',
      'I wanted a demo that translated raw landmarks into game state, collision logic, and feedback loops without server latency.',
      'It also makes webcam permissions, model warmup, and graceful degradation visible to non-technical reviewers.',
    ],
    tech: ['TensorFlow.js', 'MediaPipe Face Mesh', 'Canvas', 'React'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/GameCam',
    fallbackSrc: '/previews/face-mesh-fallback.gif',
    fallbackAlt: 'Fallback GIF preview for the face mesh interaction demo.',
    loadingLabel: 'Loading face mesh demo...',
    minHeight: 560,
    loader: loadGameCam,
  },
  {
    title: 'Recruiter Q&A Assistant',
    icon: <SmartToyIcon fontSize="small" />,
    summary:
      'Transformer-powered question answering over my profile. It gives recruiters a faster way to validate fit than scanning a long resume.',
    whyBuilt: [
      'Built to package my background into a searchable, conversational layer instead of relying only on static text.',
      'The point was to show product thinking: reduce recruiter effort while exposing transformer inference directly in the browser.',
      'I also wanted a demo where model limits are obvious, so the UX sets expectations and still remains useful.',
    ],
    tech: ['Transformers.js', 'TensorFlow.js QnA', 'React', 'MUI'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/BertChat',
    fallbackSrc: '/previews/assistant-fallback.gif',
    fallbackAlt: 'Fallback GIF preview for the recruiter Q and A assistant.',
    loadingLabel: 'Loading recruiter assistant...',
    minHeight: 520,
    loader: loadChat,
  },
  {
    title: 'Computer Vision Detection Demo',
    icon: <VisibilityIcon fontSize="small" />,
    summary:
      'Webcam inference pipeline for defect detection with threshold controls. It highlights model serving, warmup, and user-visible confidence tuning.',
    whyBuilt: [
      'Built as a concrete bridge between my thesis work and front-end product delivery.',
      'I wanted to show that I can expose ML predictions in a UI that stakeholders can inspect, tune, and reason about.',
      'This demo also makes reliability tradeoffs explicit when webcam access or device performance becomes the limiting factor.',
    ],
    tech: ['TensorFlow.js', 'YOLOv8 GraphModel', 'WebGL', 'React'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/CICam',
    fallbackSrc: '/previews/vision-fallback.gif',
    fallbackAlt: 'Fallback GIF preview for the computer vision detection demo.',
    loadingLabel: 'Loading CV detection demo...',
    minHeight: 520,
    loader: loadCIDetectionCam,
  },
];

const previewSx = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.88) 50%, rgba(15,118,110,0.52))',
};

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
    link.href = '/Mart%C3%ADn%20Borba%20L%C3%B3pez%20CV.pdf';
    link.click();
  };

  const renderPreview = (demo: DemoDefinition) => (
    <Box sx={previewSx}>
      <Box
        component="img"
        src={demo.fallbackSrc}
        alt={demo.fallbackAlt}
        sx={{
          width: '100%',
          display: 'block',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          opacity: 0.9,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 2, md: 3 },
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.2) 38%, rgba(15,23,42,0.78) 100%)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Chip
            label="GIF fallback"
            size="small"
            sx={{
              bgcolor: 'rgba(248,250,252,0.14)',
              color: '#f8fafc',
              border: '1px solid rgba(248,250,252,0.22)',
            }}
          />
          <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.88)' }}>
            Live demo loads only when device/browser conditions look healthy.
          </Typography>
        </Stack>

        <Box>
          <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
            {demo.title}
          </Typography>
          <Typography sx={{ color: 'rgba(226,232,240,0.88)', maxWidth: 620 }}>
            Recruiter-friendly preview for slow devices, denied webcam access, or quick portfolio scans.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(13,148,136,0.18), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.14), transparent 28%), linear-gradient(180deg, rgba(248,250,252,0.98), rgba(241,245,249,0.98))',
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            border: '1px solid',
            borderColor: 'divider',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(241,245,249,0.96) 55%, rgba(204,251,241,0.72))',
            boxShadow: '0 28px 80px rgba(15, 23, 42, 0.08)',
            mb: 5,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Chip
                label="AI + full-stack engineer"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(15,118,110,0.12)',
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              />
              <Typography variant="h1" component="h1" sx={{ maxWidth: 760 }}>
                Martin Borba
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{ maxWidth: 860, color: 'text.secondary', mb: 2 }}
              >
                Computer engineer building recruiter-friendly web products, ML demos, and systems
                that make technical depth easy to scan quickly.
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 820, color: 'text.secondary' }}>
                Based in Montevideo, Uruguay. I work across product UX, front-end delivery, and
                applied AI prototyping, with a particular pull toward backend architecture and
                system design.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
              {recruiterStack.map((item) => (
                <Chip key={item} label={item} variant="outlined" />
              ))}
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              divider={<Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />}
            >
              {recruiterSignals.map((signal) => (
                <Typography key={signal} variant="body2" sx={{ color: 'text.secondary' }}>
                  {signal}
                </Typography>
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
              <Button
                onClick={onDownloadCV}
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                endIcon={<ContactPageIcon />}
              >
                Download resume
              </Button>
              <Button
                onClick={onDownloadScholarship}
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                endIcon={<DescriptionIcon />}
              >
                Download degree report
              </Button>
              <Button
                href="https://github.com/M-Borba/ReactCV"
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                startIcon={<GitHubIcon />}
                endIcon={<LaunchIcon />}
              >
                View portfolio code
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <ScienceIcon color="primary" />
          <Typography variant="h2" component="h2">
            Interactive demos
          </Typography>
        </Stack>

        <Stack spacing={4}>
          {demos.map((demo) => (
            <Paper
              key={demo.title}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0 22px 48px rgba(15, 23, 42, 0.07)',
              }}
            >
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', lg: 'center' }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {demo.icon}
                      <Typography variant="h4" component="h3">
                        {demo.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 900 }}>
                      {demo.summary}
                    </Typography>
                  </Box>

                  <Button
                    href={demo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    endIcon={<LaunchIcon />}
                  >
                    View code on GitHub
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {demo.tech.map((techItem) => (
                    <Chip key={techItem} label={techItem} size="small" />
                  ))}
                </Stack>

                <Box>
                  {demo.whyBuilt.map((line) => (
                    <Typography key={line} variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>
                      {line}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Preview GIF available as a lightweight fallback if the live model takes time to load
                  or webcam permissions are blocked.
                </Typography>

                {renderPreview(demo)}

                <DeferredRender
                  loader={demo.loader}
                  minHeight={demo.minHeight}
                  loadingLabel={demo.loadingLabel}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mt: 5,
            p: 3,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            For more context, the live demos and this recruiter-focused portfolio shell are all in
            the same repo:{' '}
            <Link
              href="https://github.com/M-Borba/ReactCV"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/M-Borba/ReactCV
            </Link>
            .
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default MBorba;
