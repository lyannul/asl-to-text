import { CameraState } from "./const";

export const setupCamera = async (videoRef: any, setCameraState: any) => {
  const constraints = {
    audio: false,
    video: {
      facingMode: "user", // 'user' or 'environment'
    },
  };
  if (videoRef !== null) {
    const mediaStream = await navigator.mediaDevices
      .getUserMedia(constraints)
      .catch((err) => {
        if (err.name === "NotAllowedError") {
          setCameraState(CameraState.PERMISSION_DENIED);
          return;
        } else {
          setCameraState(CameraState.NOT_FOUND);
          return;
        }
      });
    if (mediaStream) {
      videoRef.current.srcObject = mediaStream;
      setCameraState(CameraState.READY);
    }
  } else return;
};
