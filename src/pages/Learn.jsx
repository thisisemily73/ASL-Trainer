import React, { useState } from 'react';
import { lessonPath } from '../data/lessons/lessonPath';

function Learn() {
  const [activeUnitKey, setActiveUnitKey] = useState('prologue');
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [lockedPreviewUnit, setLockedPreviewUnit] = useState(null);

  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState('quiz');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const unit = lessonPath[activeUnitKey];
  const lessonData = unit?.lessons.find(l => l.id === activeLesson);
  const currentSign = lessonData?.signs?.[currentSignIndex] || null;

  const handleSelectUnit = (unitKey) => {
    const targetUnit = lessonPath[unitKey];
    
    // If you want to lock units dynamically if they aren't prologue or unit-1:
    const isLocked = unitKey !== 'prologue' && unitKey !== 'unit-1'; 

    if (isLocked) {
      setLockedPreviewUnit({ ...targetUnit, id: unitKey });
    } else if (targetUnit) {
      setActiveUnitKey(unitKey);
      setShowUnitSelector(false);
      setActiveLesson(null);
    }
  };

  const handleStartLesson = (lessonId) => {
    setActiveLesson(lessonId);
    setCurrentSignIndex(0);
    setTheoryIndex(0);
    setCurrentStep('quiz');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
    if (option === currentSign.correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(false);
        setCurrentStep('webcam');
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  const handleWebcamSuccess = () => {
    if (lessonData.signs && currentSignIndex < lessonData.signs.length - 1) {
      setCurrentSignIndex(prev => prev + 1);
      setCurrentStep('quiz');
    } else {
      setActiveLesson(null);
    }
  };

  if (activeLesson && lessonData) {
    if (lessonData.type === 'theory') {
      const currentConcept = lessonData.content[theoryIndex];
      const isLastConcept = theoryIndex === lessonData.content.length - 1;

      return (
        <div className="max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-xl mt-10">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setActiveLesson(null)} className="text-sm text-indigo-400 hover:underline cursor-pointer">
              ← Exit Lesson
            </button>
            <span className="text-sm bg-indigo-600 px-3 py-1 rounded-full font-medium">
              {lessonData.label} • Concept {theoryIndex + 1}/{lessonData.content.length}
            </span>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl space-y-4 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-indigo-300">{currentConcept.title}</h2>
            <p className="text-slate-300 text-base leading-relaxed py-4">{currentConcept.description}</p>
          </div>
          <div className="flex justify-between mt-6">
            <button 
              disabled={theoryIndex === 0}
              onClick={() => setTheoryIndex(prev => prev - 1)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${theoryIndex === 0 ? 'opacity-40 cursor-not-allowed bg-slate-800' : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'}`}
            >
              ← Previous
            </button>
            <button 
              onClick={() => {
                if (isLastConcept) setActiveLesson(null);
                else setTheoryIndex(prev => prev + 1);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            >
              {isLastConcept ? 'Complete Lesson ✓' : 'Next Concept →'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-2xl shadow-xl mt-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setActiveLesson(null)} className="text-sm text-indigo-400 hover:underline cursor-pointer">
            ← Exit Lesson
          </button>
          <span className="text-sm bg-indigo-600 px-3 py-1 rounded-full font-medium">
            {lessonData.label} • {currentStep === 'quiz' ? `Sign ${currentSignIndex + 1}/${lessonData.signs.length} (Quiz)` : 'Live Practice'}
          </span>
        </div>

        {currentStep === 'quiz' && currentSign ? (
          <div className="space-y-6">
            <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
              <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-lg mb-4 border border-dashed border-slate-700">
                <span className="text-slate-400">[ Diagram for "{currentSign.word}" ]</span>
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
                  <button key={index} onClick={() => handleOptionClick(option)} className={`p-4 rounded-xl font-semibold border transition-all duration-200 text-center cursor-pointer ${btnStyle}`}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold mb-2">Now, try signing: {currentSign?.word}!</h2>
              <p className="text-sm text-slate-400 mb-4">{currentSign?.hint}</p>
              <div className="h-64 bg-black rounded-lg flex flex-col items-center justify-center border border-slate-700 relative overflow-hidden p-4">
                <span className="text-slate-500 text-sm mb-4">[ Camera Feed Active ]</span>
                <button onClick={handleWebcamSuccess} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer">
                  Simulate Successful Sign →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page learn-content-grid relative">
      
      {/* Locked Unit Preview Modal */}
      {lockedPreviewUnit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">🔒 LOCKED UNIT</span>
              <button onClick={() => setLockedPreviewUnit(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <h3 className="text-xl font-bold">{lockedPreviewUnit.title}</h3>
            <p className="text-sm text-slate-300">Complete previous units to unlock this content!</p>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-2 font-semibold uppercase tracking-wider">Lessons Included:</span>
              <ul className="space-y-1 text-sm text-slate-300">
                {lockedPreviewUnit.lessons.map(l => (
                  <li key={l.id} className="flex items-center gap-2">🔒 {l.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Lesson Content */}
      <main className="path-main-immersive">
        
        {/* Unit Banner Card */}
        <div className="unit-banner-card flex flex-col gap-3 relative">
          <div className="flex justify-between items-center">
            <span style={{ color: '#0d9488', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              {unit.title}
            </span>
            <button 
              onClick={() => setShowUnitSelector(!showUnitSelector)}
              className="unit-selector-btn ml-auto"
            >
              Explore All Units {showUnitSelector ? '▲' : '▼'}
            </button>
          </div>

          {/* Unit Dropdown Selector Drawer */}
          {showUnitSelector && (
            <div className="unit-dropdown-drawer">
              {Object.entries(lessonPath).map(([key, u]) => {
                const isSelected = key === activeUnitKey;
                const isLocked = key !== 'prologue' && key !== 'unit-1';

                let itemClass = "unit-dropdown-item";
                if (isSelected) itemClass += " selected";
                else if (isLocked) itemClass += " locked";

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectUnit(key)}
                    className={itemClass}
                  >
                    <div>
                      <div className="text-sm font-semibold">{u.title}</div>
                      {isLocked && <span className="text-xs text-amber-600 font-normal">Locked • Click to Preview</span>}
                    </div>
                    <span>{isSelected ? '✓' : isLocked ? '🔒' : '→'}</span>
                  </button>
                );
              })}
            </div>
          )}

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: '4px 0' }}>
            {activeUnitKey === 'prologue' ? 'Foundations & Anatomy' : 'Fundamentals'}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#0d9488', fontWeight: '600', marginTop: '4px' }}>
            <span>{unit.lessons.length} lessons in this unit</span>
            <span>Ready</span>
          </div>
          
          <div style={{ width: '100%', background: '#ccfbf1', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
            <div style={{ background: '#0d9488', height: '100%', width: activeUnitKey === 'prologue' ? '100%' : '35%', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Vertical Lesson Path Cards */}
        <div className="lesson-path-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <h3>LESSON PATH</h3>

          {unit.lessons.map((lesson) => {
            const isCompleted = lesson.status === 'completed';
            const isActive = lesson.status === 'active';
            const isLocked = lesson.status === 'locked';

            return (
              <div 
                key={lesson.id} 
                className={`lesson-card ${isActive ? 'active-lesson' : ''} ${isLocked ? 'locked-lesson' : ''}`}
              >
                <div className="lesson-card-left">
                  <div className={`lesson-icon ${isCompleted ? '' : isActive ? 'active-icon' : 'locked-icon'}`}>
                    {isCompleted ? '✓' : isActive ? (lesson.icon || '👋') : '🔒'}
                  </div>
                  <div className="lesson-info">
                    <h4>{lesson.label}</h4>
                    <p>⏱ 5 min &nbsp;•&nbsp; ⚡ 50 XP &nbsp;•&nbsp; {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Locked'}</p>
                  </div>
                </div>

                {!isLocked && (
                  <button onClick={() => handleStartLesson(lesson.id)} className="start-btn cursor-pointer">
                    {isCompleted ? 'Review →' : 'Start →'}
                  </button>
                )}
              </div>
            );
          })}
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