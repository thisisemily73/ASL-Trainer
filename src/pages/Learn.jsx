
import React, { useState } from 'react';
import { lessonPath } from '../data/lessons/lessonPath';
import { AvatarCanvas } from '../components/AvatarCanvas';

import CameraBox from "../components/CameraBox";
import { evaluatePractice } from "../utils/practice/practiceLogic";

// const UNLOCKED_UNITS = new Set(['prologue', 'unit-1']);

const INITIAL_GOALS = [
  { id: 'signs', label: 'Learn 5 Signs Today' },
  { id: 'practice', label: 'Practice 15 Mins' },
  { id: 'unit', label: 'Complete Unit 1' },
];

function Learn() {
  const [activeUnitKey, setActiveUnitKey] = useState('prologue');
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [lockedPreviewUnit, setLockedPreviewUnit] = useState(null);

  const [practiceResetKey, setPracticeResetKey] = useState(0);

  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState('quiz');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedGoals, setCompletedGoals] = useState(['signs']);

  const unit = lessonPath[activeUnitKey];
  const lessons = unit?.lessons || [];

  const lessonData = lessons.find(lesson => lesson.id === activeLesson);
  const currentSign = lessonData?.signs?.[currentSignIndex] || null;

  const lessonKey = (unitKey, lessonId) => `${unitKey}:${lessonId}`;

  const isLessonCompleted = (unitKey, lessonId) =>
    completedLessons.includes(lessonKey(unitKey, lessonId));

  const getLessonState = (lesson, index) => {
    if (isLessonCompleted(activeUnitKey, lesson.id)) {
      return 'completed';
    }

    // Lessons unlock in order, after the previous lesson is completed.
    const previousLesson = lessons[index - 1];

    if (
      index === 0 ||
      (previousLesson &&
        isLessonCompleted(activeUnitKey, previousLesson.id))
    ) {
      return 'available';
    }

    return 'locked';
  };

  const completedCount = lessons.filter(lesson =>
    isLessonCompleted(activeUnitKey, lesson.id)
  ).length;

  const unitProgress = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const finishLesson = () => {
    if (!activeLesson) return;

    const key = lessonKey(activeUnitKey, activeLesson);

    setCompletedLessons(previous =>
      previous.includes(key) ? previous : [...previous, key]
    );

    setActiveLesson(null);
    setCurrentSignIndex(0);
    setTheoryIndex(0);
    setCurrentStep('quiz');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };


  const handleSelectUnit = unitKey => {
    const targetUnit = lessonPath[unitKey];

    if (!targetUnit) return;

    setActiveUnitKey(unitKey);
    setActiveLesson(null);
    setShowUnitSelector(false);
    setLockedPreviewUnit(null);
  };


  const handleStartLesson = lessonId => {
    setActiveLesson(lessonId);
    setCurrentSignIndex(0);
    setTheoryIndex(0);
    setCurrentStep('quiz');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  const handleExitLesson = () => {
    setActiveLesson(null);
    setCurrentSignIndex(0);
    setTheoryIndex(0);
    setCurrentStep('quiz');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  const handleOptionClick = option => {
    if (!currentSign || isCorrect) return;

    setSelectedAnswer(option);
    setIsCorrect(option === currentSign.correctAnswer);
  };

  const handleContinueToPractice = () => {
    if (!isCorrect) return;

    setSelectedAnswer(null);
    setIsCorrect(false);
    setCurrentStep('practice');
  };

  const handlePracticeComplete = () => {
    if (!lessonData?.signs?.length) {
      finishLesson();
      return;
    }

    if (currentSignIndex < lessonData.signs.length - 1) {
      setCurrentSignIndex(index => index + 1);
      setCurrentStep('quiz');
      setSelectedAnswer(null);
      setIsCorrect(false);
    } else {
      finishLesson();
    }
  };

  const toggleGoal = goalId => {
    setCompletedGoals(previous =>
      previous.includes(goalId)
        ? previous.filter(id => id !== goalId)
        : [...previous, goalId]
    );
  };

  // PRACTICE
  const [practiceResult, setPracticeResult] = useState(null);
  const [cameraStatus, setCameraStatus] = useState(
    "Turn on your camera when you're ready."
  );

  const handleSignSubmitted = (detection) => {
    const result = evaluatePractice(currentSign?.word, detection);

    setPracticeResult(result);
  };

  const handlePracticeRetry = () => {
    setPracticeResult(null);
    setCameraStatus("Try the sign again.");
    setPracticeResetKey((key) => key + 1);
  };

  const handlePracticeContinue = () => {
    if (practiceResult?.status !== "correct") return;

    setPracticeResult(null);
    handlePracticeComplete();
  };

  // Lesson screen
  if (activeLesson && lessonData) {
    const concepts = lessonData.content || [];
    const currentConcept = concepts[theoryIndex];
    const isTheory = lessonData.type === 'theory';
    const isLastConcept = theoryIndex >= concepts.length - 1;

    return (
      <div className="learn-lesson-page">
        <div className="learn-lesson-shell">
          <header className="learn-lesson-header">
            <button
              type="button"
              onClick={handleExitLesson}
              className="learn-text-button"
            >
              ← Exit lesson
            </button>

            <span className="learn-lesson-counter">
              {lessonData.label}
              {isTheory
                ? ` · ${concepts.length ? theoryIndex + 1 : 0}/${concepts.length}`
                : ` · ${currentSign ? currentSignIndex + 1 : 0}/${lessonData.signs?.length || 0}`}
            </span>
          </header>

          {isTheory ? (
            <section className="learn-activity-card">
              {currentConcept ? (
                <>
                  <p className="learn-eyebrow">LEARN</p>
                  <h2>{currentConcept.title}</h2>
                  <p className="learn-concept-description">
                    {currentConcept.description}
                  </p>

                  <div className="learn-lesson-actions">
                    <button
                      type="button"
                      className="learn-secondary-button"
                      disabled={theoryIndex === 0}
                      onClick={() =>
                        setTheoryIndex(index => Math.max(0, index - 1))
                      }
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      className="learn-primary-button"
                      onClick={() => {
                        if (isLastConcept) {
                          finishLesson();
                        } else {
                          setTheoryIndex(index => index + 1);
                        }
                      }}
                    >
                      {isLastConcept ? 'Complete lesson' : 'Next concept →'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>This lesson has no content yet.</h2>
                  <p>
                    Add concepts to this lesson in your lesson data before
                    completing it.
                  </p>
                  <button
                    type="button"
                    className="learn-secondary-button"
                    onClick={handleExitLesson}
                  >
                    Back to lessons
                  </button>
                </>
              )}
            </section>
          ) : currentSign ? (
            <section className="learn-activity-card">
              {currentStep === 'quiz' ? (
                <>
                  <p className="learn-eyebrow">IDENTIFY THE SIGN</p>

                  <div className="learn-avatar-preview">
                    <AvatarCanvas currentSign={currentSign.word} />
                  </div>

                  <h2>Which sign matches the handshape?</h2>
                  <p className="learn-hint">{currentSign.hint}</p>

                  <div className="learn-answer-grid">
                    {(currentSign.options || []).map(option => {
                      const selected = selectedAnswer === option;
                      let stateClass = '';

                      if (selected && isCorrect) {
                        stateClass = ' answer-correct';
                      } else if (selected && !isCorrect) {
                        stateClass = ' answer-incorrect';
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isCorrect}
                          aria-pressed={selected}
                          onClick={() => handleOptionClick(option)}
                          className={`learn-answer-button${stateClass}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer && (
                    <p
                      className={`learn-answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'
                        }`}
                      role="status"
                    >
                      {isCorrect
                        ? 'Correct! Ready to practice.'
                        : 'Not quite. Try another answer.'}
                    </p>
                  )}

                  {isCorrect && (
                    <button
                      type="button"
                      className="learn-primary-button learn-continue-button"
                      onClick={handleContinueToPractice}
                    >
                      Continue to practice →
                    </button>
                  )}
                </>
              ) : (

                <>
                  <p className="learn-eyebrow">YOUR TURN</p>
                  <h2>Practice: {currentSign.word}</h2>
                  <p className="learn-hint">{currentSign.hint}</p>

                  <CameraBox
                    key={practiceResetKey}
                    title="SIGN PRACTICE"
                    height="400px"
                    onSignDetected={(message) => setCameraStatus(message)}
                    onSignSubmitted={handleSignSubmitted}

                  />

                  <p className="learn-practice-note" aria-live="polite">
                    {cameraStatus}
                  </p>

                  {practiceResult && (
                    <div
                      className={`practice-feedback practice-feedback--${practiceResult.status}`}
                      role="status"
                    >
                      <h3>
                        {practiceResult.status === "correct"
                          ? "Nice work!"
                          : practiceResult.status === "incorrect"
                            ? "Not quite yet"
                            : "Try again"}
                      </h3>

                      <p>{practiceResult.message}</p>

                      {practiceResult.status === "correct" ? (
                        <button
                          type="button"
                          className="learn-primary-button"
                          onClick={handlePracticeContinue}
                        >
                          Continue →
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="learn-primary-button"
                          onClick={handlePracticeRetry}
                        >
                          Try again
                        </button>
                      )}
                    </div>
                  )}
                </>

              )}
            </section>
          ) : (
            <section className="learn-activity-card">
              <h2>No signs found for this lesson yet.</h2>
              <p>Check the signs data for this lesson.</p>
              <button
                type="button"
                className="learn-secondary-button"
                onClick={handleExitLesson}
              >
                Back to lessons
              </button>
            </section>
          )}
        </div>
      </div>
    );
  }

  // Main Learn page
  return (
    <div className="page learn-content-grid">
      {lockedPreviewUnit && (
        <div
          className="learn-modal-backdrop"
          onClick={() => setLockedPreviewUnit(null)}
        >
          <section
            className="learn-locked-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="locked-unit-title"
            onClick={event => event.stopPropagation()}
          >
            <div className="learn-modal-header">
              <span className="learn-locked-label">Locked unit</span>
              <button
                type="button"
                className="learn-close-button"
                aria-label="Close"
                onClick={() => setLockedPreviewUnit(null)}
              >
                ×
              </button>
            </div>

            <h2 id="locked-unit-title">{lockedPreviewUnit.title}</h2>
            <p>Complete the earlier lessons to unlock this unit.</p>

            <div className="learn-locked-lessons">
              <p>LESSONS IN THIS UNIT</p>
              <ul>
                {(lockedPreviewUnit.lessons || []).map(lesson => (
                  <li key={lesson.id}>{lesson.label}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="learn-primary-button"
              onClick={() => setLockedPreviewUnit(null)}
            >
              Got it
            </button>
          </section>
        </div>
      )}

      <main className="path-main-immersive">
        <section className="unit-banner-card">
          <div className="learn-unit-topline">
            <span className="learn-eyebrow">{unit?.title}</span>

            <button
              type="button"
              className="unit-selector-btn"
              aria-expanded={showUnitSelector}
              onClick={() => setShowUnitSelector(value => !value)}
            >
              Explore units {showUnitSelector ? '↑' : '↓'}
            </button>
          </div>

          {showUnitSelector && (
            <div className="unit-dropdown-drawer">
              {Object.entries(lessonPath).map(([key, item]) => {
                const selected = key === activeUnitKey;

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleSelectUnit(key)}
                    className={[
                      'unit-dropdown-item',
                      selected ? 'selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span>
                      <span className="unit-dropdown-title">
                        {item.title}
                      </span>
                      <span className="unit-dropdown-subtitle">
                        {selected ? 'Currently viewing' : 'Available'}
                      </span>
                    </span>
                    <span aria-hidden="true">
                      {selected ? '✓' : '→'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <h1 className="learn-page-title">
            {activeUnitKey === 'prologue'
              ? 'Foundations & Anatomy'
              : unit?.title || 'Learn ASL'}
          </h1>

          <p className="learn-unit-description">
            Work through each lesson at your own pace. Finish one to unlock the
            next.
          </p>

          <div className="learn-progress-labels">
            <span>
              {completedCount} of {lessons.length} lessons completed
            </span>
            <span>{unitProgress}%</span>
          </div>

          <div
            className="learn-progress-track"
            role="progressbar"
            aria-label="Unit progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={unitProgress}
          >
            <div
              className="learn-progress-fill"
              style={{ width: `${unitProgress}%` }}
            />
          </div>
        </section>

        <section className="lesson-path-list">
          <h2 className="learn-section-label">LESSON PATH</h2>

          {lessons.map((lesson, index) => {
            const status = getLessonState(lesson, index);
            const locked = status === 'locked';
            const completed = status === 'completed';
            const active = status === 'available';

            return (
              <article
                key={lesson.id}
                className={[
                  'lesson-card',
                  active ? 'active-lesson' : '',
                  locked ? 'locked-lesson' : '',
                  completed ? 'completed-lesson' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="lesson-card-left">
                  <div
                    className={[
                      'lesson-icon',
                      active ? 'active-icon' : '',
                      locked ? 'locked-icon' : '',
                      completed ? 'completed-icon' : '',
                    ].filter(Boolean).join(' ')}
                    aria-hidden="true"
                  >
                    {completed ? '✓' : locked ? '🔒' : lesson.icon || '👋'}
                  </div>

                  <div className="lesson-info">
                    <h3>{lesson.label}</h3>
                    <p>
                      {completed
                        ? 'Completed'
                        : locked
                          ? 'Complete the previous lesson to unlock'
                          : 'Ready to learn'}
                    </p>
                  </div>
                </div>

                {locked ? (
                  <span className="lesson-status-locked">Locked</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartLesson(lesson.id)}
                    className="start-btn"
                  >
                    {completed ? 'Review' : 'Start'} →
                  </button>
                )}
              </article>
            );
          })}
        </section>
      </main>

      <aside className="learn-sidebar-minimal">
        <section className="sidebar-card">
          <div className="learn-sidebar-heading">
            <h2>MY GOALS</h2>
            <span>{completedGoals.length}/{INITIAL_GOALS.length}</span>
          </div>

          <div className="learn-goal-list">
            {INITIAL_GOALS.map(goal => {
              const checked = completedGoals.includes(goal.id);

              return (
                <label className="goal-item" key={goal.id}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleGoal(goal.id)}
                  />
                  <span className={checked ? 'goal-complete' : ''}>
                    {goal.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="learn-goal-progress">
            <div
              className="learn-progress-track"
              role="progressbar"
              aria-label="Daily goals"
              aria-valuemin={0}
              aria-valuemax={INITIAL_GOALS.length}
              aria-valuenow={completedGoals.length}
            >
              <div
                className="learn-progress-fill"
                style={{
                  width: `${(completedGoals.length / INITIAL_GOALS.length) * 100
                    }%`,
                }}
              />
            </div>
          </div>
          <p className="learn-small-note">
            These checkboxes are session-only for now.
          </p>
        </section>

        <section className="sidebar-card">
          <h2>DEAF CULTURE SPOTLIGHT</h2>
          <span className="culture-tag">Turquoise & Navy</span>
          <p>
            Learn about the colors and symbols used by members of the Deaf
            community, and remember that no single symbol represents everyone.
          </p>
        </section>

        <section className="sidebar-card-dark">
          <span>KEEP GOING</span>
          <h2>
            {completedCount === lessons.length && lessons.length > 0
              ? 'Unit complete'
              : 'One lesson at a time'}
          </h2>
          <p>
            {completedCount === lessons.length && lessons.length > 0
              ? 'You’ve finished the lessons currently available in this unit.'
              : 'Finish your current lesson to open the next step in your path.'}
          </p>
        </section>
      </aside>
    </div>
  );
}

export default Learn;