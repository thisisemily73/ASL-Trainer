import React, { useState } from 'react';

function Learn() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState('quiz');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentSign = {
    word: "Basic Greetings (Hello)",
    hint: "Wave hand gently from side to side.",
    options: ["Hello", "Thank You", "Goodnight", "Please"],
    correctAnswer: "Hello"
  };

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
    if (option === currentSign.correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentStep('webcam');
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  if (activeLesson) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-xl mt-10">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => { setActiveLesson(null); setCurrentStep('quiz'); setSelectedAnswer(null); }}
            className="text-sm text-indigo-400 hover:underline cursor-pointer"
          >
            ← Exit Lesson
          </button>
          <span className="text-sm bg-indigo-600 px-3 py-1 rounded-full font-medium">
            {currentStep === 'quiz' ? 'Step 1: Recognition' : 'Step 2: Live MediaPipe Practice'}
          </span>
        </div>

        {currentStep === 'quiz' ? (
          <div className="space-y-6">
            <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
              <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-lg mb-4 border border-dashed border-slate-700">
                <span className="text-slate-400">[ Animation / Diagram for "{currentSign.word}" ]</span>
              </div>
              <h2 className="text-xl font-bold mb-2">What is the correct sign?</h2>
              <p className="text-sm text-slate-400">{currentSign.hint}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentSign.options.map((option, index) => {
                let btnStyle = "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white";
                if (selectedAnswer === option) {
                  btnStyle = isCorrect ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white";
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`p-4 rounded-xl font-semibold border transition-all duration-200 text-center cursor-pointer ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-2">Now, try it live!</h2>
              <p className="text-sm text-slate-400 mb-4">Perform the sign in front of your camera.</p>
              
              <div className="h-64 bg-black rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
                <span className="text-slate-500 text-sm">[ MediaPipe Skeleton Feed Active ]</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page learn-content-grid">
      {/* Main Lesson Content */}
      <main className="path-main-immersive">
        
        {/* Unit Banner Card */}
        <div className="unit-banner-card">
          <span>UNIT 1</span>
          <h2>Fundamentals</h2>
          <div className="flex justify-between items-center text-xs text-slate-500 mb-2" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
            <span>2/4 lessons</span>
            <span>50% complete</span>
          </div>
          <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--accent)', height: '100%', width: '50%', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="metric-card">
            <span className="metric-icon">🔥</span>
            <div>
              <div className="metric-value">5</div>
              <div className="metric-label">Day Streak</div>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">⚡</span>
            <div>
              <div className="metric-value">90</div>
              <div className="metric-label">Total XP</div>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">✅</span>
            <div>
              <div className="metric-value">2</div>
              <div className="metric-label">Lessons Done</div>
            </div>
          </div>
        </div>

        {/* Vertical Lesson Path Cards */}
        <div className="lesson-path-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <h3>LESSON PATH</h3>

          {/* Completed Lesson 1 */}
          <div className="lesson-card">
            <div className="lesson-card-left">
              <div className="lesson-icon">✓</div>
              <div className="lesson-info">
                <h4>Alphabet Part 1</h4>
                <p>⏱ 8 min &nbsp;•&nbsp; ⚡ 50 XP &nbsp;•&nbsp; Completed</p>
              </div>
            </div>
          </div>

          {/* Completed Lesson 2 */}
          <div className="lesson-card">
            <div className="lesson-card-left">
              <div className="lesson-icon">✓</div>
              <div className="lesson-info">
                <h4>Numbers 1-10</h4>
                <p>⏱ 6 min &nbsp;•&nbsp; ⚡ 40 XP &nbsp;•&nbsp; Completed</p>
              </div>
            </div>
          </div>

          {/* Active Lesson */}
          <div className="lesson-card active-lesson">
            <div className="lesson-card-left">
              <div className="lesson-icon active-icon">👋</div>
              <div className="lesson-info">
                <h4>Basic Greetings</h4>
                <p>⏱ 10 min &nbsp;•&nbsp; ⚡ 60 XP &nbsp;•&nbsp; In Progress</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveLesson("greetings")}
              className="start-btn"
            >
              Start →
            </button>
          </div>

          {/* Locked Lesson */}
          <div className="lesson-card locked-lesson">
            <div className="lesson-card-left">
              <div className="lesson-icon locked-icon">🔒</div>
              <div className="lesson-info">
                <h4>Alphabet Part 2</h4>
                <p>⏱ 9 min &nbsp;•&nbsp; ⚡ 50 XP &nbsp;•&nbsp; Locked</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Sidebar */}
      <aside className="learn-sidebar-minimal">
        {/* Goals Group */}
        <div className="sidebar-card">
          <h3>MY GOALS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="goal-item">
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
              <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Learn 5 Signs Today</span>
            </label>
            <label className="goal-item">
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span>Practice 15 Mins</span>
            </label>
            <label className="goal-item">
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
              <span>Complete Unit 1</span>
            </label>
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
              <span>1/3 goals</span>
              <span>33%</span>
            </div>
            <div style={{ width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--accent)', height: '100%', width: '33%', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>

        {/* Culture Spotlight */}
        <div className="sidebar-card">
          <h3>DEAF CULTURE SPOTLIGHT</h3>
          <div className="culture-tag">
            💙 Turquoise & Navy
          </div>
          <p>
            Why Turquoise and Navy Blue were chosen for ASL pride and community representation.
          </p>
          <a href="#read" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textDecoration: 'none' }}>Read more →</a>
        </div>

        {/* Up Next Card */}
        <div className="sidebar-card-dark">
          <span>UP NEXT</span>
          <h4>Unit 2: Expressions</h4>
          <p>
            Facial grammar, emotions, and conversational flow.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Learn;