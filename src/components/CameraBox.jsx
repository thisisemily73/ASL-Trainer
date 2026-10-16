import React, { useRef, useEffect, useState } from 'react';
import { HandLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { detectSign } from '../utils/signDetector/detectSign';

function CameraBox({
    height = '400px',
    title = "LIVE ASL SANDBOX",
    onStreamToggle,
    onSignDetected,
    onSignSubmitted,
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

    const [signLocked, setSignLocked] = useState(false);
    const signLockedRef = useRef(false);


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

    // HELPER TO PROCESS AND SUBMIT WHEN HANDS DROP
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
                signLockedRef.current = true;
                setSignLocked(true);

                onSignSubmitted(
                    { word: topSign, match: topMatchPercent },
                    alternatives
                );
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

        if (!video || !canvas) {
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }

        if (!handLandmarkerRef.current || !poseLandmarkerRef.current) {
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }

        if (video.readyState >= 2 && !video.paused && !video.ended) {
            const startTimeMs = performance.now();
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
            }

            if (
                canvas.width !== video.videoWidth ||
                canvas.height !== video.videoHeight
            ) {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
            }

            const poseResults = poseLandmarkerRef.current.detectForVideo(
                video,
                startTimeMs
            );

            const handResults = handLandmarkerRef.current.detectForVideo(
                video,
                startTimeMs
            );

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let resultMessage = 'Show hand to camera to begin...';
            let confidenceScore = 0;

            const handsPresent =
                handResults.landmarks &&
                handResults.landmarks.length > 0;

            // Always draw detected hands, even after submission.
            if (handsPresent) {
                for (const landmarks of handResults.landmarks) {
                    drawHandSkeleton(
                        ctx,
                        landmarks,
                        canvas.width,
                        canvas.height
                    );
                }
            } else if (poseResults.landmarks && poseResults.landmarks.length > 0) {
                for (const landmarks of poseResults.landmarks) {
                    drawPoseSkeleton(
                        ctx,
                        landmarks,
                        canvas.width,
                        canvas.height
                    );
                }
            }

            // Once submitted, stop recording new signs.
            if (signLockedRef.current) {
                resultMessage = 'Sign submitted! Retry to practice again.';
                confidenceScore = 100;
            } else if (handsPresent) {
                missingHandFramesRef.current = 0;

                const currentHand = handResults.landmarks[0];

                if (!isRecordingRef.current) {
                    isRecordingRef.current = true;
                    sessionFramesRef.current = [];
                }

                const detected = detectSign(currentHand);

                if (
                    detected &&
                    !detected.includes('Unknown') &&
                    !detected.includes('No sign')
                ) {
                    sessionFramesRef.current.push({
                        sign: detected,
                        landmarks: currentHand
                    });

                    resultMessage =
                        `Recording gesture... (${sessionFramesRef.current.length} frames)`;
                    confidenceScore = 85;
                } else {
                    resultMessage = 'Holding pose (Keep steady)...';
                    confidenceScore = 50;
                }
            } else {
                // No hands are visible: wait before submitting the recording.
                if (isRecordingRef.current) {
                    missingHandFramesRef.current += 1;
                    resultMessage = 'Hand dropped! Analyzing...';

                    if (missingHandFramesRef.current >= 12) {
                        isRecordingRef.current = false;

                        const framesToProcess = sessionFramesRef.current;
                        sessionFramesRef.current = [];
                        missingHandFramesRef.current = 0;

                        processRecordedSession(framesToProcess);
                    }
                } else if (
                    poseResults.landmarks &&
                    poseResults.landmarks.length > 0
                ) {
                    resultMessage = 'Body tracked (Raise your hand)';
                    confidenceScore = 30;
                }
            }

            if (
                onSignDetected &&
                resultMessage !== lastSentSignRef.current
            ) {
                lastSentSignRef.current = resultMessage;
                onSignDetected(resultMessage, confidenceScore);
            }

            ctx.restore();
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    };


    const drawHandSkeleton = (ctx, landmarks, width, height) => {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12],
            [9, 13], [13, 14], [14, 15], [15, 16],
            [13, 17], [17, 18], [18, 19], [19, 20],
            [0, 17]
        ];

        ctx.strokeStyle = '#66e3b4';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        connections.forEach(([start, end]) => {
            ctx.beginPath();
            ctx.moveTo(
                landmarks[start].x * width,
                landmarks[start].y * height
            );
            ctx.lineTo(
                landmarks[end].x * width,
                landmarks[end].y * height
            );
            ctx.stroke();
        });

        landmarks.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#238b70';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    };

    const drawPoseSkeleton = (ctx, landmarks, width, height) => {
        const connections = [
            [11, 12], [11, 13], [13, 15],
            [12, 14], [14, 16], [11, 23],
            [12, 24], [23, 24], [23, 25],
            [25, 27], [24, 26], [26, 28]
        ];

        ctx.strokeStyle = '#83aaff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        connections.forEach(([start, end]) => {
            const a = landmarks[start];
            const b = landmarks[end];

            if (!a || !b || a.visibility < 0.5 || b.visibility < 0.5) {
                return;
            }

            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
        });
    };


    return (
        <div className="camera-feed-card">
            {title && (
                <h3 style={{ color: 'var(--primary)', margin: 0 }}>
                    {title}
                </h3>
            )}

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
                                if (requestRef.current) {
                                    cancelAnimationFrame(requestRef.current);
                                }

                                requestRef.current =
                                    requestAnimationFrame(predictWebcam);
                            }}
                        />

                        {/* Use this canvas directly so canvasRef is guaranteed to attach. */}
                        <canvas
                            ref={canvasRef}
                            className="mediapipe-canvas"
                        />
                    </>
                ) : (
                    <div className="camera-overlay-prompt">
                        <p>Camera is currently off</p>
                        <button
                            className="primary-action-btn"
                            onClick={startCamera}
                        >
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