import React, { useState, useRef, useEffect } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as tf from '@tensorflow/tfjs';


function Sandbox() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const handLandmarkerRef = useRef(null);
    const requestRef = useRef(null);

    const [isStreaming, setIsStreaming] = useState(false);
    const [recognizedSign, setRecognizedSign] = useState('Show your hand to the camera');
    const [confidence, setConfidence] = useState(0);

    const tfModelRef = useRef(null);
    const frameHistoryRef = useRef([]); 

    const SIGN_CLASSES = ['Hello', 'Thank You', 'I Love You', 'No Hand']; 

    // 1. Initialize MediaPipe HandLandmarker
    useEffect(() => {
        async function setupHandLandmarker() {
            try {
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
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
            }
        }
        setupHandLandmarker();

        return () => {
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }
        };
    }, []);

    // 2. Start Webcam Feed
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', predictWebcam);
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Webcam error:", err);
            alert("Unable to access camera.");
        }
    };

    // 3. Stop Webcam Feed
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        setIsStreaming(false);
        setRecognizedSign('Camera paused');
        setConfidence(0);
    };

    // 4. Real-time Prediction Loop
    const predictWebcam = () => {
        if (!videoRef.current || !canvasRef.current || !handLandmarkerRef.current) return;

        let startTimeMs = performance.now();
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Match canvas dimensions to video feed
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        if (results.landmarks && results.landmarks.length > 0) {
            const currentHand = results.landmarks[0]; // Focus on the first hand

            // Flatten the 21 landmarks into a single array of numbers: [x1, y1, z1, x2, y2, z2, ...]
            const flattenedCoordinates = currentHand.flatMap(lm => [lm.x, lm.y, lm.z]);

            // Push to your timeline history
            frameHistoryRef.current.push(flattenedCoordinates);

            // Keep only the last 30 frames (roughly 1 second of video)
            if (frameHistoryRef.current.length > 30) {
                frameHistoryRef.current.shift();
            }

            // Send a full 30-frame sequence to your recognition function for more accurate predictions
            if (frameHistoryRef.current.length === 30) {
                recognizeMovingSign(frameHistoryRef.current);
            }
        }

        // Run MediaPipe detection on current video frame
        const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks && results.landmarks.length > 0) {
            setRecognizedSign('Hand Detected! (Analyzing Sign...)');
            setConfidence(88); // Mock confidence score placeholder

            // Draw hand landmarks (skeletons) onto canvas
            for (const landmarks of results.landmarks) {
                // Draw connection lines and points using your theme colors
                drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);
            }
        } else {
            setRecognizedSign('No hands detected');
            setConfidence(0);
        }

        ctx.restore();

        // Loop frame processing
        if (videoRef.current && videoRef.current.srcObject) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    // Helper function to draw the skeleton lines and joint dots
    const drawHandSkeleton = (ctx, landmarks, width, height) => {
        // Connections defined by MediaPipe hand topology
        const CONNECTIONS = [
            [0, 1], [1, 2], [2, 3], [3, 4],         // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],         // Index
            [5, 9], [9, 10], [10, 11], [11, 12],    // Middle
            [9, 13], [13, 14], [14, 15], [15, 16],  // Ring
            [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [0, 17]                           // Palm base
        ];

        // Draw lines (Navy Blue accents)
        ctx.strokeStyle = "#1B2A4A";
        ctx.lineWidth = 3;
        for (const [i, j] of CONNECTIONS) {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            ctx.beginPath();
            ctx.moveTo(p1.x * width, p1.y * height);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
        }

        // Draw joints (Turquoise accents)
        for (const landmark of landmarks) {
            ctx.fillStyle = "#00A8A8";
            ctx.beginPath();
            ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="page sandbox-container">
            <div className="sandbox-header">
                <h2>LIVE ASL SANDBOX</h2>
                <p>Test your handshapes in real-time. MediaPipe tracks 21 distinct 3D hand landmarks.</p>
            </div>

            <div className="sandbox-workspace">
                {/* Webcam & Canvas Overlay Container */}
                <div className="camera-feed-card">
                    <div className="video-wrapper">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="webcam-video"
                        />
                        <canvas
                            ref={canvasRef}
                            className="mediapipe-canvas"
                        />
                        {!isStreaming && (
                            <div className="camera-overlay-prompt">
                                <p>Camera is currently off</p>
                                <button className="primary-action-btn" onClick={startCamera}>
                                    Turn On Camera
                                </button>
                            </div>
                        )}
                    </div>

                    {isStreaming && (
                        <div className="camera-controls">
                            <button className="secondary-action-btn" onClick={stopCamera}>
                                Pause Camera
                            </button>
                        </div>
                    )}
                </div>

                {/* Real-Time Interpretation Output Panel */}
                <div className="interpretation-panel">
                    <h3>LIVE RECOGNITION</h3>
                    <div className="output-display-box">
                        <span className="interpreted-sign-text">{recognizedSign}</span>
                    </div>

                    <div className="confidence-meter-group">
                        <label>Tracking Accuracy Match</label>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${confidence}%` }}
                            ></div>
                        </div>
                        <span className="confidence-value">{confidence}%</span>
                    </div>

                    <div className="sandbox-tips">
                        <h4>💡 MediaPipe Sandbox Tips</h4>
                        <ul>
                            <li>Make sure your entire hand fits inside the camera view.</li>
                            <li>Bright front-lighting helps the model track all 21 hand joints accurately.</li>
                            <li>Joints render in <strong>Turquoise</strong> and lines render in <strong>Navy Blue</strong>!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sandbox;