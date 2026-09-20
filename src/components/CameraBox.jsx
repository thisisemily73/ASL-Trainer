import React, { useRef, useEffect, useState } from 'react';
import { HandLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as alphabetRecognizers from '../utils/signRecognizers/alphabetRecognizer';

import { detectSign } from '../utils/signDetector/detectSign';

function CameraBox({
    height = '400px',
    title = "LIVE ASL SANDBOX",
    onStreamToggle,
    onSignDetected,
    renderCanvas
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const requestRef = useRef(null);
    const mediaStreamRef = useRef(null);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const frameHistoryRef = useRef([]);
    const lastSentSignRef = useRef(''); // <-- ADD THIS LINE HERE

    useEffect(() => {
        async function setupLandmarkers() {
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

                poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1
                });

                console.log("MediaPipe models loaded.");
            } catch (error) {
                console.error("Error loading MediaPipe models:", error);
            }
        }
        setupLandmarkers();

        return () => {
            if (handLandmarkerRef.current) handLandmarkerRef.current.close();
            if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
        };
    }, []);


    // Safely attach the media stream when the camera turns active
    useEffect(() => {
        if (isCameraActive && videoRef.current && mediaStreamRef.current) {
            videoRef.current.srcObject = mediaStreamRef.current;
        }
    }, [isCameraActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
            if (onStreamToggle) onStreamToggle(true, stream, videoRef.current);
        } catch (err) {
            console.error("Webcam error:", err);
            alert("Unable to access camera.");
        }
    };

    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        setIsCameraActive(false);
        if (onStreamToggle) onStreamToggle(false, null, null);
        if (onSignDetected) onSignDetected('Camera paused', 0);
    };

    // Continuous Loop Function
    const predictWebcam = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !handLandmarkerRef.current || !poseLandmarkerRef.current) return;

        // Ensure video is actively playing before processing frame
        if (video.readyState >= 2 && !video.paused && !video.ended) {
            let startTimeMs = performance.now();
            const ctx = canvas.getContext('2d');

            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
            }

            const poseResults = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);
            const handResults = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let hasBodyOrHand = false;
            let resultMessage = 'No body/hands detected';
            let confidenceScore = 0;

            if (handResults.landmarks && handResults.landmarks.length > 0) {
                hasBodyOrHand = true;
                const currentHand = handResults.landmarks[0];

                // DETECT SIGN LOGIC
                const detected = detectSign(currentHand);
                console.log("Detected sign:", detected);

                // If your detectSign function found a letter
                if (detected && !detected.includes("Unknown") && !detected.includes("No sign")) {
                    resultMessage = detected;
                    confidenceScore = 95;
                } else {
                    resultMessage = 'Hand Detected (Hold pose...)';
                    confidenceScore = 60;
                }

                const flattenedCoordinates = currentHand.flatMap(lm => [lm.x, lm.y, lm.z]);
                frameHistoryRef.current.push(flattenedCoordinates);
                if (frameHistoryRef.current.length > 30) {
                    frameHistoryRef.current.shift();
                }

                for (const landmarks of handResults.landmarks) {
                    drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);
                }
            } else if (poseResults.landmarks && poseResults.landmarks.length > 0) {
                hasBodyOrHand = true;
                resultMessage = 'Body Tracked (Show your hand)';
                confidenceScore = 40;

                for (const landmarks of poseResults.landmarks) {
                    drawPoseSkeleton(ctx, landmarks, canvas.width, canvas.height);
                }
            }

            // Send the final calculated message up to Sandbox ONLY IF IT CHANGES
            if (onSignDetected && resultMessage !== lastSentSignRef.current) {
                lastSentSignRef.current = resultMessage;
                onSignDetected(resultMessage, confidenceScore);
            }

            ctx.restore();

        }

        // Keep the loop alive seamlessly
        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    const drawPoseSkeleton = (ctx, landmarks, width, height) => {
        const POSE_CONNECTIONS = [
            [11, 12],
            [11, 13], [13, 15],
            [12, 14], [14, 16],
            [11, 23], [12, 24],
            [23, 24]
        ];

        ctx.strokeStyle = "rgba(27, 42, 74, 0.6)"; // Navy blue for limbs
        ctx.lineWidth = 3;

        for (const [i, j] of POSE_CONNECTIONS) {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            // Lowered visibility threshold slightly to catch upper body easier
            if (p1 && p2 && (p1.visibility > 0.3 && p2.visibility > 0.3)) {
                ctx.beginPath();
                ctx.moveTo(p1.x * width, p1.y * height);
                ctx.lineTo(p2.x * width, p2.y * height);
                ctx.stroke();
            }
        }

        for (let i = 11; i <= 16; i++) {
            const landmark = landmarks[i];
            if (landmark && landmark.visibility > 0.3) {
                ctx.fillStyle = "#00A8A8"; // Turquoise joints
                ctx.beginPath();
                ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    };

    const drawHandSkeleton = (ctx, landmarks, width, height) => {
        const HAND_CONNECTIONS = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12],
            [9, 13], [13, 14], [14, 15], [15, 16],
            [13, 17], [17, 18], [18, 19], [19, 20],
            [0, 17]
        ];

        ctx.strokeStyle = "#1B2A4A";
        ctx.lineWidth = 3;
        for (const [i, j] of HAND_CONNECTIONS) {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            ctx.beginPath();
            ctx.moveTo(p1.x * width, p1.y * height);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
        }

        for (const landmark of landmarks) {
            ctx.fillStyle = "#00A8A8";
            ctx.beginPath();
            ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    return (
        <div className="camera-feed-card">
            {title && <h3 style={{ color: 'var(--primary)', margin: 0 }}>{title}</h3>}

            <div className="video-wrapper" style={{ height }}>
                {isCameraActive ? (
                    <>
                        <video
                            ref={videoRef}
                            className="webcam-video"
                            autoPlay
                            playsInline
                            muted
                            onLoadedData={() => {
                                if (requestRef.current) cancelAnimationFrame(requestRef.current);
                                requestRef.current = requestAnimationFrame(predictWebcam);
                            }}
                        />
                        {renderCanvas ? renderCanvas(canvasRef) : <canvas ref={canvasRef} className="mediapipe-canvas" />}
                    </>
                ) : (
                    <div className="camera-overlay-prompt">
                        <p>Camera is currently off</p>
                        <button className="primary-action-btn" onClick={startCamera}>
                            Turn On Camera
                        </button>
                    </div>
                )}
            </div>

            {isCameraActive && (
                <button className="turn-off-btn" onClick={stopCamera}>
                    Turn Off Camera
                </button>
            )}
        </div>
    );
}

export default CameraBox;