import React, { useState } from 'react';
import CameraBox from '../components/CameraBox';

function Sandbox() {
    const [recognizedSign, setRecognizedSign] = useState('Show your hand to the camera');
    const [confidence, setConfidence] = useState(0);

    return (
        <div className="page sandbox-container">
            <div className="sandbox-header">
                <h2>LIVE ASL SANDBOX</h2>
                <p>Test your handshapes in real-time. MediaPipe tracks 21 distinct 3D hand landmarks.</p>
            </div>

            <div className="sandbox-workspace">
                {/* Modular Camera Component passing sign updates up to Sandbox */}
                <CameraBox
                    title=""
                    onSignDetected={(sign, conf) => {
                        setRecognizedSign(sign);
                        setConfidence(conf);
                    }}
                />

                {/* Real-Time Interpretation Output Panel */}
                <div className="interpretation-panel">
                    {/* ... rest of your panel code ... */}

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
        </div>
    );
}

export default Sandbox;