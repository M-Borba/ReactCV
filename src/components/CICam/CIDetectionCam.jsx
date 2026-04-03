import { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import CircularProgress from "@mui/material/CircularProgress";
import { detectVideo } from "./utils/detect";
import Slider from "@mui/material/Slider";
import { Webcam } from "./utils/webcam";
import "./app.css";

const getWebcamErrorMessage = (error) => {
  if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
    return "Camera access was denied. Please allow webcam permissions in your browser to use this demo.";
  }

  if (error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError") {
    return "No camera was found on this device.";
  }

  if (error?.message === "WEBCAM_UNSUPPORTED") {
    return "This browser does not support webcam access.";
  }

  return "The webcam could not be started. Please check your browser permissions and device settings.";
};

const CIDetectionCam = () => {
  const [conf_threshold, setThreshold] = useState(0.5); // confidence threshold state
  const [loading, setLoading] = useState(true); // loading state
  const [cameraError, setCameraError] = useState("");
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape
  const webcam = new Webcam(); // webcam handler

  // references
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const thresholdRef = useRef(conf_threshold);
  const stopDetectionRef = useRef(null);

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
    };
  }, []);

  useEffect(() => {
    if (!model.net || !cameraRef.current || !canvasRef.current || cameraError) {
      return;
    }

    if (stopDetectionRef.current) {
      stopDetectionRef.current();
    }

    stopDetectionRef.current = detectVideo(
      cameraRef.current,
      model,
      canvasRef.current,
      () => thresholdRef.current,
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
      </div>
    </div>
  );
};

export default CIDetectionCam;
