import './MBorba.css';
import type { ComponentType, ReactElement } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
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
  loadingLabel: string;
  minHeight: number;
  loader: () => Promise<{ default: ComponentType }>;
};

const profileStack = [
  'Python',
  'Node.js',
  'PostgreSQL',
  'FastAPI',
  'TensorFlow',
  'PyTorch',
  'Docker',
  'TypeScript',
];

const profileSignals = [
  'ML backend systems',
  'Inference and data pipelines',
  'API and system design',
];

const profileFacts = [
  'Based in Montevideo, Uruguay',
  'Computer engineer focused on backend systems, applied ML, and production-minded architecture',
];

const demos: DemoDefinition[] = [
  {
    title: 'Face Mesh Interaction Demo',
    icon: <SportsEsportsIcon fontSize="small" />,
    summary:
      'Browser game driven by facial landmark detection. It turns computer vision primitives into a playful interaction that still feels product-aware.',
    whyBuilt: [
      'Built to prove that real-time browser inference can feel responsive enough for consumer-facing UX.',
      'Landmarks become game state, collision logic, and feedback loops without any server round-trip.',
      'It also makes webcam permissions, model warmup, and graceful degradation obvious to non-technical reviewers.',
    ],
    tech: ['TensorFlow.js', 'MediaPipe Face Mesh', 'Canvas', 'React'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/GameCam',
    loadingLabel: 'Loading face mesh demo...',
    minHeight: 560,
    loader: loadGameCam,
  },
  {
    title: 'Profile Q&A Assistant',
    icon: <SmartToyIcon fontSize="small" />,
    summary:
      'Transformer-powered question answering over my profile. It offers a faster way to explore key details than scanning static text, using a fixed background passage embedded directly in the browser.',
    whyBuilt: [
      'Built to package my background into a searchable conversational layer instead of relying only on static text.',
      'The product idea is simple: expose transformer inference directly in the browser through a practical interface.',
      'The model only answers from that embedded passage, so the UX is intentionally scoped instead of pretending to be a general assistant.',
      'It also shows where model limits appear, so the UX sets expectations while staying useful.',
    ],
    tech: ['Transformers.js', 'TensorFlow.js QnA', 'React', 'MUI'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/BertChat',
    loadingLabel: 'Loading profile assistant...',
    minHeight: 520,
    loader: loadChat,
  },
  {
    title: 'Computer Vision Detection Demo',
    icon: <VisibilityIcon fontSize="small" />,
    summary:
      'Webcam inference pipeline for defect detection with threshold controls. It highlights model serving, warmup, and user-visible confidence tuning.',
    whyBuilt: [
      'Built as a direct bridge between thesis-style vision work and front-end product delivery.',
      'The goal was to show ML predictions in a UI that stakeholders can inspect, tune, and reason about.',
      'It also makes reliability tradeoffs visible when webcam access or device performance becomes the limiting factor.',
    ],
    tech: ['TensorFlow.js', 'YOLOv8 GraphModel', 'WebGL', 'React'],
    githubUrl: 'https://github.com/M-Borba/ReactCV/tree/main/src/components/CICam',
    loadingLabel: 'Loading CV detection demo...',
    minHeight: 520,
    loader: loadCIDetectionCam,
  },
];

const colors = {
  pageText: '#f8fafc',
  mutedText: 'rgba(226,232,240,0.72)',
  bodyText: 'rgba(226,232,240,0.8)',
  accent: '#5eead4',
  line: 'rgba(148,163,184,0.16)',
  chipBg: 'rgba(15,23,42,0.18)',
};

const pageBackground =
  'radial-gradient(circle at top left, rgba(45,212,191,0.2), transparent 25%), radial-gradient(circle at 88% 10%, rgba(251,146,60,0.16), transparent 20%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.16), transparent 28%), linear-gradient(180deg, #020617 0%, #0f172a 42%, #111827 100%)';

const surfaceBackground =
  'linear-gradient(140deg, rgba(15,23,42,0.88) 0%, rgba(30,41,59,0.8) 46%, rgba(15,118,110,0.42) 100%)';

const surfaceOverlay =
  'radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 24%), radial-gradient(circle at 20% 15%, rgba(251,191,36,0.1), transparent 22%)';

const demoFrameBackground =
  'linear-gradient(180deg, rgba(2,6,23,0.42), rgba(15,23,42,0.2))';

const downloadFile = (filename: string, href: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = href;
  link.click();
};

function renderTechChip(label: string) {
  return (
    <Chip
      key={label}
      label={label}
      size="small"
      sx={{
        color: '#cbd5e1',
        bgcolor: 'rgba(15,23,42,0.24)',
        border: `1px solid ${colors.line}`,
      }}
    />
  );
}

function renderHeroChip(label: string) {
  return (
    <Chip
      key={label}
      label={label}
      variant="outlined"
      sx={{
        color: '#e2e8f0',
        borderColor: 'rgba(226,232,240,0.22)',
        bgcolor: colors.chipBg,
      }}
    />
  );
}

function DemoSection({ demo }: { demo: DemoDefinition }) {
  return (
    <Box sx={{ py: { xs: 4, md: 5 } }}>
      <Stack spacing={3.5} alignItems="stretch">
        <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 720 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
              <Box sx={{ color: colors.accent, display: 'flex', alignItems: 'center' }}>{demo.icon}</Box>
              <Typography variant="h4" component="h3" sx={{ color: colors.pageText }}>
                {demo.title}
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: colors.bodyText }}>
              {demo.summary}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {demo.tech.map(renderTechChip)}
          </Stack>

          <Stack spacing={0.9}>
            {demo.whyBuilt.map((line) => (
              <Typography key={line} variant="body2" sx={{ color: colors.mutedText }}>
                {line}
              </Typography>
            ))}
          </Stack>

          <Button
            href={demo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon />}
            endIcon={<LaunchIcon />}
            sx={{
              alignSelf: 'flex-start',
              color: '#e2e8f0',
              borderColor: 'rgba(226,232,240,0.22)',
              '&:hover': {
                borderColor: colors.pageText,
                bgcolor: 'rgba(248,250,252,0.06)',
              },
            }}
          >
            View code on GitHub
          </Button>
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderRadius: 4,
              border: `1px solid ${colors.line}`,
              background: demoFrameBackground,
              p: { xs: 1.25, md: 1.75 },
            }}
          >
            <DeferredRender
              loader={demo.loader}
              minHeight={demo.minHeight}
              loadingLabel={demo.loadingLabel}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1.25,
              color: 'rgba(226,232,240,0.46)',
              letterSpacing: '0.06em',
            }}
          >
            Live browser demo. Best experienced on desktop with camera permissions enabled when
            required.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function MBorba() {
  return (
    <Box sx={{ minHeight: '100vh', background: pageBackground, color: colors.pageText }}>
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 8 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 4, md: 6 },
            border: `1px solid ${colors.line}`,
            background: surfaceBackground,
            boxShadow: '0 36px 120px rgba(2, 6, 23, 0.45)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: surfaceOverlay,
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={{ xs: 6, md: 8 }} sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 5 } }}>
            <Stack spacing={4}>
              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={{ xs: 4, lg: 6 }}
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box sx={{ maxWidth: 760 }}>
                  <Chip
                    label="AI + full-stack engineer"
                    sx={{
                      mb: 2,
                      bgcolor: 'rgba(248,250,252,0.1)',
                      color: colors.pageText,
                      border: '1px solid rgba(248,250,252,0.16)',
                      fontWeight: 700,
                    }}
                  />
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      maxWidth: 760,
                      color: colors.pageText,
                      textShadow: '0 10px 24px rgba(15,23,42,0.3)',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    Martin Borba
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{ maxWidth: 760, color: 'rgba(226,232,240,0.94)', mb: 2 }}
                  >
                    Computer engineer focused on ML backend systems, inference
                    pipelines, and APIs built for real-world products.
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: 700, color: 'rgba(226,232,240,0.78)' }}>
                    I work across backend architecture, model integration, and applied AI delivery,
                    with a strong interest in scalable systems, data flow, and reliable product infrastructure.
                  </Typography>
                </Box>

                <Stack spacing={1.25} sx={{ minWidth: { lg: 260 }, pt: { lg: 2 } }}>
                  <Typography variant="overline" sx={{ color: colors.accent, letterSpacing: '0.18em' }}>
                    Profile
                  </Typography>
                  {profileFacts.map((fact) => (
                    <Box key={fact} sx={{ py: 1.25, borderTop: '1px solid rgba(148,163,184,0.18)' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.76)' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                {profileStack.map(renderHeroChip)}
              </Stack>

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                divider={
                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(226,232,240,0.16)' }}
                  />
                }
              >
                {profileSignals.map((signal) => (
                  <Typography key={signal} variant="body2" sx={{ color: 'rgba(226,232,240,0.78)' }}>
                    {signal}
                  </Typography>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
                <Button
                  onClick={() => downloadFile('MBorba_CV.pdf', '/Mart%C3%ADn%20Borba%20L%C3%B3pez%20CV.pdf')}
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  endIcon={<ContactPageIcon />}
                  sx={{
                    bgcolor: '#f8fafc',
                    color: '#0f172a',
                    '&:hover': { bgcolor: '#e2e8f0' },
                  }}
                >
                  Download resume
                </Button>
                <Button
                  onClick={() => downloadFile('MBorba_scholarship.pdf', '/ReporteEscolaridadEgreso.pdf')}
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  endIcon={<DescriptionIcon />}
                  sx={{
                    color: colors.pageText,
                    borderColor: 'rgba(248,250,252,0.34)',
                    '&:hover': {
                      borderColor: colors.pageText,
                      bgcolor: 'rgba(248,250,252,0.08)',
                    },
                  }}
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
                  sx={{
                    color: '#cbd5e1',
                    '&:hover': { color: colors.pageText, bgcolor: 'rgba(248,250,252,0.08)' },
                  }}
                >
                  View portfolio code
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              >
                <Box>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <ScienceIcon sx={{ color: colors.accent }} />
                    <Typography variant="h2" component="h2" sx={{ color: colors.pageText, marginBottom: '0 !important' }}>
                      Interactive demos
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ mt: 1.25, maxWidth: 760, color: colors.mutedText }}>
                    A small set of live browser experiments that show how I think about product,
                    interaction, and machine learning in the same build.
                  </Typography>
                </Box>

                <Typography variant="overline" sx={{ color: 'rgba(226,232,240,0.5)', letterSpacing: '0.18em' }}>
                  Selected work
                </Typography>
              </Stack>
            </Stack>

            <Stack divider={<Divider sx={{ borderColor: 'rgba(148,163,184,0.14)' }} />}>
              {demos.map((demo) => (
                <DemoSection key={demo.title} demo={demo} />
              ))}
            </Stack>

            <Box sx={{ pt: 1, borderTop: '1px solid rgba(148,163,184,0.14)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.68)' }}>
                For more context, the live demos and this portfolio shell are all
                in the same repo:{' '}
                <Link
                  href="https://github.com/M-Borba/ReactCV"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: colors.accent }}
                >
                  github.com/M-Borba/ReactCV
                </Link>
                .
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default MBorba;
