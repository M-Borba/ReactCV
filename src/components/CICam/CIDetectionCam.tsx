import { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import CircularProgress from "@mui/material/CircularProgress";
import { detectVideo } from "./utils/detect";
import Slider from "@mui/material/Slider";
import { Webcam } from "./utils/webcam";
import "./app.css";

// Declare Tesseract on window
declare global {
  interface Window {
    Tesseract: any;
  }
}


const getWebcamErrorMessage = (error: unknown) => {
  const err = error as Error;
  if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
    return "Camera access was denied. Please allow webcam permissions in your browser to use this demo.";
  }

  if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
    return "No camera was found on this device.";
  }

  if (err?.message === "WEBCAM_UNSUPPORTED") {
    return "This browser does not support webcam access.";
  }

  return "The webcam could not be started. Please check your browser permissions and device settings.";
}
const OCR_COOLDOWN_MS = 1200;
const TESSERACT_CDN_URL =
  "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

const formatIdentityDigits = (digits: string = "") => {
  if (digits.length < 7) return "";
  const body = digits.slice(0, -1);
  const checkDigit = digits.slice(-1);
  return `${body}-${checkDigit}`;
};

const parseIdentityNumber = (rawText: string = "") => {
  console.log("rawText", rawText)
  const identityMatch = rawText.match(
    /(?:N[°ºo]?\s*(?:DE\s*)?IDENTIDAD|NUM(?:ERO)?\s*DE\s*IDENTIDAD|CI)\s*[:\-]?\s*([0-9.\- ]{6,})/i,
  );

  const pickDigits = (value = "") => (value.match(/\d/g) || []).join("");
  const directDigits = pickDigits(identityMatch?.[1] || "");
  if (directDigits.length >= 7) return formatIdentityDigits(directDigits);

  const candidates = rawText.match(/\d[\d.\- ]{5,}\d/g) || [];
  const best = candidates
    .map((candidate) => pickDigits(candidate))
    .filter((digits) => digits.length >= 7)
    .sort((a, b) => b.length - a.length)[0];

  return formatIdentityDigits(best || "");
};

const loadTesseract = async () => {
  if (window.Tesseract) return window.Tesseract;

  const existingScript = document.querySelector(`script[src="${TESSERACT_CDN_URL}"]`);
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN_URL;
    script.async = true;
    document.head.appendChild(script);
  }

  await new Promise((resolve, reject) => {
    const checkLoaded = () => {
      if (window.Tesseract) resolve();
      else reject(new Error("Unable to load OCR engine"));
    };

    const script = document.querySelector(`script[src="${TESSERACT_CDN_URL}"]`);
    if (!script) {
      reject(new Error("OCR script missing"));
      return;
    }

    if (window.Tesseract) {
      resolve();
      return;
    }

    script.addEventListener("load", checkLoaded, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load OCR script")),
      { once: true },
    );
  });

  return window.Tesseract;
};

const getCropCanvas = (source: HTMLVideoElement, bbox: { x: number; y: number; width: number; height: number; }, targetCanvas: HTMLCanvasElement) => {
  if (!source || !bbox || !targetCanvas) return null;
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
  if (!sourceWidth || !sourceHeight) return null;

  const x = Math.max(0, Math.floor(bbox.x));
  const y = Math.max(0, Math.floor(bbox.y));
  const width = Math.min(sourceWidth - x, Math.floor(bbox.width));
  const height = Math.min(sourceHeight - y, Math.floor(bbox.height));
  if (width < 10 || height < 10) return null;

  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(source, x, y, width, height, 0, 0, width, height);
  return targetCanvas;
};

const CIDetectionCam = () => {
  const [conf_threshold, setThreshold] = useState(0.5); // confidence threshold state
  const [loading, setLoading] = useState(true); // loading state
  const [cameraError, setCameraError] = useState("");
  const [ocrStatus, setOcrStatus] = useState("Esperando frente de CI...");
  const [identityNumber, setIdentityNumber] = useState("");
  const [model, setModel] = useState<{ net: tf.GraphModel | null; inputShape: number[] }>({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape
  const webcam = new Webcam(); // webcam handler

  // references
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thresholdRef = useRef(conf_threshold);
  const stopDetectionRef = useRef<(() => void) | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const isOcrBusyRef = useRef(false);
  const lastOcrAtRef = useRef(0);

  // model configs
  const modelName = "ci_detection";

  useEffect(() => {
    thresholdRef.current = conf_threshold;
  }, [conf_threshold]);

  useEffect(() => {
    let isMounted = true;

    const initializeDemo = async () => {
      try {
        await webcam.open(cameraRef.current);

        if (cameraRef.current) {
          cameraRef.current.style.display = "block";
        }

        await tf.ready();
        const yolov8 = await tf.loadGraphModel(
          `${window.location.href}/${modelName}_modelv3/model.json`,
          {
            onProgress: () => {
              if (isMounted) {
                setLoading(true);
              }
            },
          },
        ); // load model

        const dummyInput = tf.ones(yolov8.inputs[0].shape);
        const warmupResults = yolov8.execute(dummyInput);

        if (!isMounted) {
          tf.dispose([warmupResults, dummyInput]);
          return;
        }

        setLoading(false);
        setCameraError("");
        setModel({
          net: yolov8,
          inputShape: yolov8.inputs[0].shape,
        }); // set model & input shape

        tf.dispose([warmupResults, dummyInput]); // cleanup memory
      } catch (error) {
        console.log("Error initializing webcam or model:", error);
        if (isMounted) {
          setLoading(false);
          setCameraError(getWebcamErrorMessage(error));
        }
      }
    };

    initializeDemo();

    return () => {
      isMounted = false;
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
        stopDetectionRef.current = null;
      }
      webcam.close(cameraRef.current);
      // Cleanup the model
      if (model.net) {
        model.net.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!model.net || !cameraRef.current || !canvasRef.current || cameraError) {
      return undefined;
    }

    if (stopDetectionRef.current) {
      stopDetectionRef.current();
    }

    stopDetectionRef.current = detectVideo(
      cameraRef.current,
      model,
      canvasRef.current,
      () => thresholdRef.current,
      async (bestFrontDetection) => {
        if (!bestFrontDetection) {
          if (!isOcrBusyRef.current) {
            setOcrStatus("Esperando frente de CI...");
          }
          return;
        }

        const now = Date.now();
        if (
          isOcrBusyRef.current ||
          now - lastOcrAtRef.current < OCR_COOLDOWN_MS
        ) {
          return;
        }

        isOcrBusyRef.current = true;
        lastOcrAtRef.current = now;
        setOcrStatus("Leyendo Nº identidad...");

        try {
          const source = cameraRef.current;
          if (!source) return;
          const cropCanvas = getCropCanvas(
            source,
            bestFrontDetection.bbox,
            cropCanvasRef.current,
          );
          if (!cropCanvas) {
            setOcrStatus("No se pudo recortar la CI");
            return;
          }

          const Tesseract = await loadTesseract();
          const { data } = await Tesseract.recognize(cropCanvas, "spa", {
            tessedit_pageseg_mode: "6",
          });

          const identityNumber = parseIdentityNumber(data?.text || "");

          if (!identityNumber) {
            setOcrStatus("Nº identidad no encontrado");
            return;
          }

          setIdentityNumber(identityNumber);
          setOcrStatus("OCR completo");
        } catch (error) {
          setOcrStatus("OCR falló");
        } finally {
          isOcrBusyRef.current = false;
        }
      },
    );

    return () => {
      if (stopDetectionRef.current) {
        stopDetectionRef.current();
        stopDetectionRef.current = null;
      }
    };
  }, [model, cameraError]);

  return (
    <div className="CIDetectionCam">
      <div className="header">
        <h1> YOLOv8 detection model 🪪</h1>

        {loading ? (
          <div>
            Loading model... <CircularProgress />
          </div>
        ) : cameraError ? (
          <p>{cameraError}</p>
        ) : (
          <p>
            Serving model : <code className="code">{modelName}</code>
          </p>
        )}
      </div>

      <div className="content">
        <video autoPlay muted ref={cameraRef} />

        <canvas
          width={model.inputShape[1]}
          height={model.inputShape[2]}
          ref={canvasRef}
        />

        {!cameraError && (
          <div className="slider">
            <Slider
              value={conf_threshold}
              onChange={(event, newValue) => setThreshold(Array.isArray(newValue) ? newValue[0] : newValue)}
              aria-labelledby="confidence-threshold-slider"
              valueLabelDisplay="auto"
              step={0.01}
              marks
              min={0}
              max={1}
            />
            <p>Confidence Threshold: {conf_threshold.toFixed(2)}</p>
          </div>
        )}

        <div className="ocr-panel">
          <p className="ocr-status">Estado OCR: {ocrStatus}</p>
          <p>Nº Identidad: {identityNumber || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default CIDetectionCam;
