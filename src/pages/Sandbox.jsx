import React, { useState, useEffect } from 'react';
import CameraBox from '../components/CameraBox';

function Sandbox() {
    const [recentSigns, setRecentSigns] = useState([]);
    const [submittedResult, setSubmittedResult] = useState(null); // { word, match, alternatives }

    // Listen for Spacebar to dismiss the result and continue
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && submittedResult) {
                setSubmittedResult(null); // Clear result to resume live tracking
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submittedResult]);

    return (
        <div className="sandbox-workspace">
            {/* LEFT COLUMN: Camera Box */}
            <div className="sandbox-left-column">
                <CameraBox
                    height="100%"
                    title=""
                    onSignSubmitted={(topResult, alternatives) => {
                        // When hand drops, lock in the result for the right-hand box!
                        setSubmittedResult({
                            ...topResult,
                            alternatives
                        });
                        // Add to recent signs history
                        setRecentSigns(prev => [topResult.word, ...prev.slice(0, 4)]);
                    }}
                />
            </div>

            {/* RIGHT COLUMN */}
            <div className="sandbox-right-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* LIVE RECOGNITION BOX */}
                <div className="live-recognition-card" style={{ padding: '20px', background: 'var(--container)', borderRadius: '20px', border: '2px dashed var(--primary)' }}>
                    <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>LIVE RECOGNITION</h3>

                    {submittedResult ? (
                        /* --- TRANSFORMED STATE: Show Detected Sign & Alternatives --- */
                        <div 
                            style={{ textAlign: 'center', padding: '15px 0', cursor: 'pointer' }}
                            onClick={() => setSubmittedResult(null)}
                        >
                            <p style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 700, margin: 0 }}>
                                DETECTED SIGN
                            </p>
                            <h1 style={{ fontSize: '4rem', margin: '5px 0', color: 'var(--text-main)' }}>
                                {submittedResult.word}
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '15px' }}>
                                {submittedResult.match}% Match
                            </p>

                            {submittedResult.alternatives && submittedResult.alternatives.length > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px', fontSize: '0.85rem', color: '#64748B' }}>
                                    <span>Other possibilities:</span>
                                    {submittedResult.alternatives.map((alt, i) => (
                                        <span key={i} style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {alt.word} ({alt.match}%)
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p>
                                Try another sign!
                            </p>
                        </div>
                    ) : (
                        /* --- NORMAL LIVE STATE: Waiting or recording --- */
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Show hand to camera to begin...</p>
                        </div>
                    )}
                </div>

                {/* SIGN DICTIONARY BOX */}
                {/* dictionary component */}

                {/* RECENTLY SIGNED BOX */}
                <div className="recent-signs-card" style={{ padding: '20px', background: 'var(--container)', borderRadius: '20px' }}>
                    <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>🕒 Recently Signed</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        {recentSigns.map((sign, index) => (
                            <div key={index} style={{ padding: '10px 15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', fontWeight: 600 }}>
                                {sign}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Sandbox;