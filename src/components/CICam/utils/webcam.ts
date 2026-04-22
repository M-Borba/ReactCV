/**
 * Class to handle webcam
 */
export class Webcam {
  /**
   * Open webcam and stream it through video tag.
   * @param {HTMLVideoElement | null} videoRef video tag reference
   */
  open = async (videoRef: HTMLVideoElement | null): Promise<MediaStream> => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw new Error("WEBCAM_UNSUPPORTED");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment",
        },
      });
      if (videoRef) {
        videoRef.srcObject = stream;
      }
      return stream;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Close opened webcam.
   * @param {HTMLVideoElement | null} videoRef video tag reference
   */
  close = (videoRef: HTMLVideoElement | null): void => {
    if (videoRef?.srcObject) {
      (videoRef.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.srcObject = null;
    }
  };
}
