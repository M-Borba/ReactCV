import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import CircularProgress from "@mui/material/CircularProgress";
import { detectVideo } from "./utils/detect";
import Slider from "@mui/material/Slider";
import { Webcam } from "./utils/webcam";
import "./app.css";

const CIDetectionCam = () => {
  const [conf_threshold, setThreshold] = useState(0.5); // confidence threshold state
  const [loading, setLoading] = useState(true); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape
  const webcam = new Webcam(); // webcam handler

  // references
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "ci_detection";

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/${modelName}_modelv3/model.json`,
        {
          onProgress: () => {
            setLoading(true);
          },
        },
      ); // load model
      // warming up model
      const dummyInput = tf.ones(yolov8.inputs[0].shape);
      const warmupResults = yolov8.execute(dummyInput);

      setLoading(false);
      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });

    webcam.open(cameraRef.current); // open webcam
    cameraRef.current.style.display = "block"; // show camera
  }, []);

  // Use useEffect to update detection when threshold changes
  useEffect(() => {
    if (model.net) {
      // Restart detection process with updated threshold
      detectVideo(cameraRef.current, model, canvasRef.current, conf_threshold);
    }
  }, [conf_threshold, model]); // dependencies include conf_threshold and model

  return (
    <div className="CIDetectionCam">
      <div className="header">
        <h1> YOLOv8 detection model 🪪</h1>

        {loading ? (
          <div>
            Loading model... <CircularProgress />
          </div>
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

        <div className="slider">
          <Slider
            value={conf_threshold}
            onChange={(event, newValue) => setThreshold(newValue)}
            aria-labelledby="confidence-threshold-slider"
            valueLabelDisplay="auto"
            step={0.01}
            marks
            min={0}
            max={1}
          />
          <p>Confidence Threshold: {conf_threshold}</p>
        </div>
      </div>
    </div>
  );
};

export default CIDetectionCam;
