import React, { useState } from 'react';

function Profile() {
    // Sample state for stats (connect to local storage later)
    const [stats] = useState({
        streak: 5,
        signsMastered: 12,
        avgAccuracy: '88%',
    });

    const [badges] = useState([
        { id: 1, title: 'First Sign', description: 'Learned your very first letter', unlocked: true, icon: '🌟' },
        { id: 2, title: 'Alphabet Pro', description: 'Mastered letters A through Z', unlocked: false, icon: '🏆' },
        { id: 3, title: '5-Day Streak', description: 'Practiced 5 days in a row', unlocked: true, icon: '🔥' },
        { id: 4, title: 'Sharp Shooter', description: 'Achieved 95%+ accuracy in Sandbox', unlocked: false, icon: '🎯' },
    ]);

    return (
        <div className="page profile-container">
            {/* Profile Header */}
            <div className="profile-header-card">
                <div className="profile-avatar">👋</div>
                <div className="profile-info">
                    <h2>ASL Learner</h2>
                    <p className="profile-subtitle">Member since September 2026</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-number">🔥 {stats.streak}</span>
                    <span className="stat-label">Day Streak</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">✋ {stats.signsMastered}</span>
                    <span className="stat-label">Signs Mastered</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">🎯 {stats.avgAccuracy}</span>
                    <span className="stat-label">Avg Accuracy</span>
                </div>
            </div>

            {/* Badges Section */}
            <div className="profile-section">
                <h3>Achievements & Badges</h3>
                <div className="badges-grid">
                    {badges.map(badge => (
                        <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                            <span className="badge-icon">{badge.icon}</span>
                            <div className="badge-details">
                                <h4>{badge.title}</h4>
                                <p>{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Section */}
            <div className="profile-section">
                <h3>Preferences</h3>
                <div className="settings-card">
                    <div className="setting-item">
                        <span>High Contrast Skeletons</span>
                        <input type="checkbox" defaultChecked />
                    </div>
                    <div className="setting-item">
                        <span>Audio Feedback Cues</span>
                        <input type="checkbox" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;