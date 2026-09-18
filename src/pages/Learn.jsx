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
            className="text-sm text-indigo-400 hover:underline"
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
                    className={`p-4 rounded-xl font-semibold border transition-all duration-200 text-center ${btnStyle}`}
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
      <main className="path-main-immersive">
        <div className="unit-banner">
          <h2>UNIT 1: FUNDAMENTALS</h2>
        </div>

        <div className="path-container">
          <svg className="path-svg" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 90 50 C 90 130, 210 130, 210 210 C 210 300, 90 300, 90 360"
              stroke="var(--border-color, #CBD5E1)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          <div className="path-nodes">
            <div className="node-wrapper node-left completed">
              <div className="node-circle">A</div>
              <span className="node-label">ALPHABET PART 1</span>
              <span className="node-status">✓ COMPLETED</span>
            </div>

            <div className="node-wrapper node-right completed">
              <div className="node-circle">5</div>
              <span className="node-label">NUMBERS 1-10</span>
              <span className="node-status">✓ COMPLETED</span>
            </div>

            <div className="node-wrapper node-left active">
              <div className="node-circle active-circle">👋</div>
              <span className="node-label">BASIC GREETINGS</span>
              <span className="node-status active-text">IN PROGRESS</span>
              <button 
                onClick={() => setActiveLesson("greetings")}
                className="start-btn cursor-pointer"
              >
                START LESSON
              </button>
            </div>

            <div className="node-wrapper node-right locked">
              <div className="node-circle">👥</div>
              <span className="node-label">FAMILY & PEOPLE</span>
              <span className="node-status">LOCKED</span>
            </div>
          </div>
        </div>
      </main>

      <aside className="learn-sidebar-minimal">
        <div className="sidebar-group">
          <h3>MY GOALS</h3>
          <label className="goal-item checked">
            <input type="checkbox" defaultChecked /> Learn 5 Signs Today
          </label>
          <label className="goal-item">
            <input type="checkbox" /> Practice 15 Mins
          </label>
        </div>

        <div className="sidebar-group culture-spotlight-minimal">
          <h3>DEAF CULTURE SPOTLIGHT</h3>
          <div className="culture-banner-text">
            <span>💙 Turquoise & Navy</span>
          </div>
          <p>Why Turquoise and Navy Blue were chosen for ASL pride and community representation.</p>
        </div>
      </aside>
    </div>
  );
}

export default Learn;