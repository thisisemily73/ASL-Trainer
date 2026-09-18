import { useParams, useNavigate } from 'react-router-dom';

function VocabWordPage() {
  const { word } = useParams();
  const navigate = useNavigate();

  const formattedWord = word ? word.charAt(0).toUpperCase() + word.slice(1) : 'Sign';

  return (
    <div className="page vocab-sign-page">
      <button className="back-btn" onClick={() => navigate('/vocab')}>
        ← Back to Vocabulary
      </button>

      <div className="practice-header">
        <div className="practice-icon-box">👋</div>
        <div className="practice-title-group">
          <h1>Practice: {formattedWord}</h1>
          <div className="badge-container">
            <span className="sign-unit-badge">Unit 1: Fundamentals</span>
            <span className="sign-cat-badge">Greetings</span>
          </div>
        </div>
      </div>

      <div className="practice-grid">
        <div className="practice-card instructions-card">
          <h3>How to sign {formattedWord}</h3>
          <p className="instruction-text">
            Raise your dominant hand to your forehead with your fingers together and thumb extended, then move it slightly outward in a saluting motion.
          </p>
          
          <div className="tips-section">
            <h4>💡 Pro Tips</h4>
            <ul>
              <li>Keep your palm facing slightly downward.</li>
              <li>Make sure your face is visible to the camera for full tracking.</li>
            </ul>
          </div>
        </div>

        <div className="practice-card camera-card">
          <div className="camera-viewfinder">
            <div className="camera-placeholder-content">
              <span className="camera-icon">📷</span>
              <p>Camera feed initializing...</p>
              <span className="status-badge waiting">Ready to Practice</span>
            </div>
          </div>
          <button className="primary-action-btn">Start Practice Session</button>
        </div>
      </div>
    </div>
  );
}

export default VocabWordPage;