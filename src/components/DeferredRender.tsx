import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {
  ComponentType,
  ReactNode,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
} from 'react';

interface DeferredRenderProps {
  loader: () => Promise<{ default: ComponentType }>;
  minHeight?: number;
  loadingLabel?: string;
}

const DeferredRender = ({
  loader,
  minHeight = 320,
  loadingLabel = 'Loading demo...',
}: DeferredRenderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const LazyComponent = useRef(lazy(loader)).current;

  useEffect(() => {
    const currentElement = containerRef.current;

    if (!currentElement || shouldRender) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '250px 0px',
        threshold: 0.15,
      },
    );

    observer.observe(currentElement);

    return () => observer.disconnect();
  }, [shouldRender]);

  const fallback: ReactNode = (
    <Box
      sx={{
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <LinearProgress />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {loadingLabel}
      </Typography>
    </Box>
  );

  return (
    <Box ref={containerRef}>
      {shouldRender ? (
        <Suspense fallback={fallback}>
          <LazyComponent />
        </Suspense>
      ) : (
        fallback
      )}
    </Box>
  );
};

export default DeferredRender;
