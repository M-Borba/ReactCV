import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;
const FRONT_LABELS = new Set(["front", "front_old"]);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Preprocess image / frame before forwarded into the model
 * @param {HTMLVideoElement|HTMLImageElement} source
 * @param {Number} modelWidth
 * @param {Number} modelHeight
 * @returns input tensor, xRatio and yRatio
 */
const preprocess = (source, modelWidth, modelHeight) => {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);

    // padding image to square => [n, m] to [n, n], n > m
    const [h, w] = img.shape.slice(0, 2); // get source width and height
    const maxSize = Math.max(w, h); // get max size
    const imgPadded = img.pad([
      [0, maxSize - h], // padding y [bottom only]
      [0, maxSize - w], // padding x [right only]
      [0, 0],
    ]);

    xRatio = maxSize / w; // update xRatio
    yRatio = maxSize / h; // update yRatio

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
      .div(255.0) // normalize
      .expandDims(0); // add batch
  });

  return [input, xRatio, yRatio];
};

/**
 * Function run inference and do detection from source.
 * @param {HTMLImageElement|HTMLVideoElement} source
 * @param {tf.GraphModel} model loaded YOLOv8 tensorflow.js model
 * @param {HTMLCanvasElement} canvasRef canvas reference
 * @param {conf_threshold} conf_threshold conf_threshold for detection
 * @param {VoidFunction} callback function to run after detection process
 */
export const detect = async (
  source,
  model,
  canvasRef,
  getConfidenceThreshold,
  callback = () => {},
  onDetection = () => {},
) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3); // get model width and height

  tf.engine().startScope(); // start scoping tf engine
  const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight); // preprocess image
  const res = model.net.execute(input); // inference model
  const transRes = res.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
  const boxes = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
    return tf
      .concat(
        [
          y1,
          x1,
          tf.add(y1, h), //y2
          tf.add(x1, w), //x2
        ],
        2,
      )
      .squeeze();
  }); // process boxes [y1, x1, y2, x2]

  const [scores, classes] = tf.tidy(() => {
    // class scores
    const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze(0); // #6 only squeeze axis 0 to handle only 1 class models
    return [rawScores.max(1), rawScores.argMax(1)];
  }); // get max scores and classes index

  const nms = await tf.image.nonMaxSuppressionAsync(
    boxes,
    scores,
    500,
    0.45,
    0.2,
  ); // NMS to filter boxes

  const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
  const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
  const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index

  renderBoxes(
    canvasRef,
    boxes_data,
    scores_data,
    classes_data,
    [xRatio, yRatio],
    getConfidenceThreshold(),
  ); // render boxes

  const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
  let bestFrontDetection = null;

  for (let i = 0; i < scores_data.length; ++i) {
    const score = scores_data[i];
    if (score < conf_threshold) continue;

    const label = labels[classes_data[i]];
    if (!FRONT_LABELS.has(label)) continue;

    let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);
    x1 = clamp(x1 / (xRatio || 1), 0, sourceWidth);
    x2 = clamp(x2 / (xRatio || 1), 0, sourceWidth);
    y1 = clamp(y1 / (yRatio || 1), 0, sourceHeight);
    y2 = clamp(y2 / (yRatio || 1), 0, sourceHeight);

    const width = Math.max(0, x2 - x1);
    const height = Math.max(0, y2 - y1);
    if (width < 10 || height < 10) continue;

    if (!bestFrontDetection || score > bestFrontDetection.score) {
      bestFrontDetection = {
        label,
        score,
        bbox: { x: x1, y: y1, width, height },
      };
    }
  }

  onDetection(bestFrontDetection);
  tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory

  callback();

  tf.engine().endScope(); // end of scoping
};

/**
 * Function to detect video from every source.
 * @param {HTMLVideoElement} vidSource video source
 * @param {tf.GraphModel} model loaded YOLOv8 tensorflow.js model
 * @param {HTMLCanvasElement} canvasRef canvas reference
 */
export const detectVideo = (
  vidSource,
  model,
  canvasRef,
<<<<<<< Updated upstream
  getConfidenceThreshold = () => 0.5,
) => {
  let isCancelled = false;
  let frameId = null;
=======
  conf_threshold,
  onDetection = () => {},
) => {
  let isActive = true;
>>>>>>> Stashed changes

  /**
   * Function to detect every frame from video
   */
  const detectFrame = async () => {
<<<<<<< Updated upstream
    if (isCancelled) {
      return;
    }
=======
    if (!isActive) return;
>>>>>>> Stashed changes

    if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
      return; // handle if source is closed
    }

<<<<<<< Updated upstream
    await detect(vidSource, model, canvasRef, getConfidenceThreshold, () => {
      if (!isCancelled) {
        frameId = requestAnimationFrame(detectFrame); // get another frame
      }
    });
=======
    if (
      canvasRef.width !== vidSource.videoWidth ||
      canvasRef.height !== vidSource.videoHeight
    ) {
      canvasRef.width = vidSource.videoWidth;
      canvasRef.height = vidSource.videoHeight;
    }

    detect(
      vidSource,
      model,
      canvasRef,
      conf_threshold,
      () => {
        requestAnimationFrame(detectFrame); // get another frame
      },
      onDetection,
    );
>>>>>>> Stashed changes
  };

  detectFrame(); // initialize to detect every frame

  return () => {
<<<<<<< Updated upstream
    isCancelled = true;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
=======
    isActive = false;
>>>>>>> Stashed changes
  };
};
