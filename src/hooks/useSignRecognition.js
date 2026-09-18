import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useSignRecognition() {
  const handLandmarkerRef = useRef(null);
  const [recognizedSign, setRecognizedSign] = useState('Show your hand');
  const [confidence, setConfidence] = useState(0);

  // Initialize MediaPipe once
  useEffect(() => {
    async function setup() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
    }
    setup();
  }, []);

  // Function any page can call by passing its video element & canvas context
  const processFrame = (video, canvasCtx, canvasWidth, canvasHeight) => {
    if (!handLandmarkerRef.current || !video) return;

    const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
    
    if (results.landmarks && results.landmarks.length > 0) {
      setRecognizedSign("Sign Detected!");
      setConfidence(90);
      return results.landmarks;
    }
    return null;
  };

  return { recognizedSign, confidence, processFrame };
}