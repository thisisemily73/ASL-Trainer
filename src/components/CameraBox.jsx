import React, { useRef, useEffect, useState } from 'react';
import { HandLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { detectSign } from '../utils/signDetector/detectSign';

function CameraBox({
    height = '400px',
    title = "LIVE ASL SANDBOX",
    onStreamToggle,
    onSignDetected,
    onSignSubmitted, // <-- ADDED PROP HERE
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
    const lastSentSignRef = useRef('');

    const missingHandFramesRef = useRef(0);
    const sessionSignHistoryRef = useRef([]);

    const isRecordingRef = useRef(false);
    const sessionFramesRef = useRef([]);


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

    // --- HELPER TO PROCESS AND SUBMIT WHEN HANDS DROP ---
    const triggerSignSubmission = () => {
        const history = sessionSignHistoryRef.current;
        if (history.length === 0) return;

        const signCounts = {};
        history.forEach(item => {
            signCounts[item.sign] = (signCounts[item.sign] || 0) + 1;
        });

        const sortedSigns = Object.entries(signCounts).sort((a, b) => b[1] - a[1]);

        if (sortedSigns.length > 0) {
            const topSign = sortedSigns[0][0];
            const topMatchPercent = Math.min(98, 75 + (sortedSigns[0][1] * 2));

            const alternatives = sortedSigns.slice(1, 3).map(([sign], idx) => ({
                word: sign,
                match: Math.max(40, topMatchPercent - (15 * (idx + 1)))
            }));

            if (onSignSubmitted) {
                onSignSubmitted({ word: topSign, match: topMatchPercent }, alternatives);
            }
        }

        // Reset session buffer
        sessionSignHistoryRef.current = [];
    };

    // Continuous Loop Function
    const processRecordedSession = (frames) => {
        // If we have enough frames, slice off the last 5-8 frames 
        // to ignore the hand-dropping motion at the very end!
        const trimmedFrames = frames.length > 8 ? frames.slice(0, -6) : frames;

        if (trimmedFrames.length === 0) return;

        const hasMovement = checkSessionMotion(trimmedFrames);

        const signCounts = {};
        trimmedFrames.forEach(item => {
            if ((item.sign === 'J' || item.sign === 'Z') && !hasMovement) {
                return; // Skip if it's a static sign masquerading as motion
            }
            signCounts[item.sign] = (signCounts[item.sign] || 0) + 1;
        });

        const sortedSigns = Object.entries(signCounts).sort((a, b) => b[1] - a[1]);

        if (sortedSigns.length > 0) {
            const topSign = sortedSigns[0][0];
            const matchCount = sortedSigns[0][1];
            const topMatchPercent = Math.min(98, Math.max(60, Math.round((matchCount / trimmedFrames.length) * 100)));

            const alternatives = sortedSigns.slice(1, 3).map(([sign], idx) => ({
                word: sign,
                match: Math.max(40, topMatchPercent - (15 * (idx + 1)))
            }));

            if (onSignSubmitted) {
                onSignSubmitted({ word: topSign, match: topMatchPercent }, alternatives);
            }
        }
    };

    const checkSessionMotion = (frames) => {
        // We need enough frames to evaluate continuous movement
        if (frames.length < 10) return false;

        // Slice off the first few frames (settling in) and last few frames (dropping out)
        // to look ONLY at the active middle of the gesture!
        const coreFrames = frames.slice(4, -6);
        if (coreFrames.length < 5) return false;

        let totalDistance = 0;
        for (let i = 1; i < coreFrames.length; i++) {
            const prev = coreFrames[i - 1].landmarks;
            const curr = coreFrames[i].landmarks;

            // Track index finger tip (landmark 8) movement in the middle of the gesture
            const dist = Math.sqrt(
                Math.pow(curr[8].x - prev[8].x, 2) +
                Math.pow(curr[8].y - prev[8].y, 2)
            );
            totalDistance += dist;
        }

        return totalDistance > 0.4; // Tune this threshold if needed
    };

    const predictWebcam = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !handLandmarkerRef.current || !poseLandmarkerRef.current) return;

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

            let resultMessage = 'Show hand to camera to begin...';
            let confidenceScore = 0;

            if (handResults.landmarks && handResults.landmarks.length > 0) {
                // HANDS ARE PRESENT: Reset drop counter
                missingHandFramesRef.current = 0;
                const currentHand = handResults.landmarks[0];

                // If we weren't recording yet, START recording session now!
                if (!isRecordingRef.current) {
                    isRecordingRef.current = true;
                    sessionFramesRef.current = [];
                }

                // Run detection on the current frame
                const detected = detectSign(currentHand);

                if (detected && !detected.includes("Unknown") && !detected.includes("No sign")) {
                    // Save this frame's detection into our session buffer
                    sessionFramesRef.current.push({ sign: detected, landmarks: currentHand });
                    resultMessage = `Recording gesture... (${sessionFramesRef.current.length} frames)`;
                    confidenceScore = 85;
                } else {
                    resultMessage = 'Holding pose (Keep steady)...';
                    confidenceScore = 50;
                }

                for (const landmarks of handResults.landmarks) {
                    drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);
                }
            } else {
                // HANDS ARE GONE (Potential drop)
                if (isRecordingRef.current) {
                    missingHandFramesRef.current += 1;
                    resultMessage = 'Hand dropped! Analyzing...';
                    confidenceScore = 0;

                    // If hands stay out of frame for ~12 frames (~400ms), finish the session and analyze!
                    if (missingHandFramesRef.current >= 12) {
                        isRecordingRef.current = false;
                        processRecordedSession(sessionFramesRef.current);
                        sessionFramesRef.current = [];
                    }
                } else {
                    if (poseResults.landmarks && poseResults.landmarks.length > 0) {
                        resultMessage = 'Body Tracked (Raise your hand)';
                        confidenceScore = 30;
                        for (const landmarks of poseResults.landmarks) {
                            drawPoseSkeleton(ctx, landmarks, canvas.width, canvas.height);
                        }
                    }
                }
            }

            if (onSignDetected && resultMessage !== lastSentSignRef.current) {
                lastSentSignRef.current = resultMessage;
                onSignDetected(resultMessage, confidenceScore);
            }

            ctx.restore();
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    // ... Keep your drawPoseSkeleton and drawHandSkeleton functions unchanged ...
    const drawPoseSkeleton = (ctx, landmarks, width, height) => { /* ... */ };
    const drawHandSkeleton = (ctx, landmarks, width, height) => { /* ... */ };

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