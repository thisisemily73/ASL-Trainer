
import { Link } from 'react-router-dom';
import { INITIAL_GOALS } from '../services/useLearn';

export default function LearnScreen({
    user,
    activeUnitKey,
    setActiveUnitKey,
    unit,
    availableUnits,
    lessons,
    completedCount,
    unitProgress,
    getLessonState,
    progressLoading,
    progressLoadFailed,
    progressMessage,
    completedGoals,
    toggleGoal,
    showUnitSelector,
    setShowUnitSelector,
    lockedPreviewUnit,
    setLockedPreviewUnit,
    accountDialog,
    setAccountDialog,
    handleSelectUnit,
    handleStartLesson,
    retryProgressLoad,
}) {
    return (
        <div className="page learn-content-grid">
            <main className="path-main-immersive">
                <section className="unit-banner-card">
                    <div className="unit-banner-heading">
                        <div>
                            <h1>{unit?.title || 'Learn ASL'}</h1>
                            <p>
                                Build your ASL skills one lesson at a time.
                            </p>
                        </div>

                        <div className="unit-selector">
                            <button
                                type="button"
                                className="unit-selector-btn"
                                onClick={() => setShowUnitSelector((open) => !open)}
                                aria-expanded={showUnitSelector}
                            >
                                Choose unit 
                                <span aria-hidden="true">
                                    {showUnitSelector ? ' −' : ' +'}
                                </span>
                            </button>

                            {showUnitSelector && (
                                <div className="unit-dropdown-drawer">
                                    {availableUnits.map((item) => {
                                        const isSelected = item.key === activeUnitKey;
                                        const isLocked = !user && item.key !== 'prologue';

                                        return (
                                            <button
                                                key={item.key}
                                                type="button"
                                                className={`unit-dropdown-item${isSelected ? ' selected' : ''}${isLocked ? ' locked' : ''}`}
                                                aria-current={isSelected ? 'true' : undefined}
                                                onClick={() => handleSelectUnit(item.key)}
                                                disabled={
                                                    progressLoading ||
                                                    progressLoadFailed ||
                                                    isSelected
                                                }
                                            >
                                                <span>
                                                    <span className="unit-dropdown-title">
                                                        {item.title}
                                                    </span>
                                                    <span className="unit-dropdown-subtitle">
                                                        {isLocked
                                                            ? 'Create an account to unlock'
                                                            : `${item.lessons?.length || 0} lessons`}
                                                    </span>
                                                </span>

                                                <span aria-hidden="true">
                                                    {isSelected ? '✓' : isLocked ? '🔒' : '→'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="unit-progress-summary">
                        <div className="unit-progress-labels">
                            <span>Unit progress</span>
                            <span>{completedCount} of {lessons.length} lessons</span>
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
                    </div>
                </section>

                {progressMessage && (
                    <p className="progress-message" role="status">
                        {progressMessage}
                    </p>
                )}

                {progressLoading ? (
                    <p>Loading your learning progress…</p>
                ) : progressLoadFailed ? (
                    <section className="sidebar-card">
                        <h2>Couldn't load your progress</h2>
                        <p>Your saved progress couldn't be retrieved.</p>
                        <button type="button" onClick={retryProgressLoad}>
                            Try again
                        </button>
                    </section>
                ) : (
                    <section className="lesson-path-list">
                        {lessons.map((lesson, index) => {
                            const state = getLessonState(lesson, index);
                            const isLocked = state === 'locked';

                            return (
                                <article
                                    key={lesson.id}
                                    className={`lesson-card lesson-card-${state}`}
                                >
                                    <div className="lesson-card-icon" aria-hidden="true">
                                        {state === 'completed'
                                            ? '✓'
                                            : isLocked
                                                ? '🔒'
                                                : lesson.icon || '👋'}
                                    </div>

                                    <div className="lesson-card-content">
                                        <p className="lesson-card-number">
                                            LESSON {index + 1}
                                        </p>
                                        <h2>{lesson.label}</h2>

                                        <p>
                                            {state === 'completed'
                                                ? 'Completed'
                                                : isLocked
                                                    ? 'Complete the previous lesson to unlock this one.'
                                                    : 'Ready when you are.'}
                                        </p>
                                    </div>

                                    <div className="lesson-card-action">
                                        {isLocked ? (
                                            !user ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLockedPreviewUnit(activeUnitKey);
                                                        setAccountDialog({
                                                            accountRequired: true,
                                                            title: 'Unlock more ASL lessons',
                                                            lessons: [],
                                                        });
                                                    }}
                                                >
                                                    Unlock
                                                </button>
                                            ) : (
                                                <span className="lesson-locked-label">Locked</span>
                                            )
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleStartLesson(lesson.id, index)}
                                            >
                                                {state === 'completed' ? 'Review' : 'Start'}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>

            <aside className="learn-sidebar-minimal">
                <section className="sidebar-card">
                    <h2>Daily goals</h2>
                    <p>Small steps add up. Keep practicing!</p>

                    <div className="goal-list">
                        {INITIAL_GOALS.map((goal) => (
                            <label className="goal-item" key={goal.id}>
                                <input
                                    type="checkbox"
                                    checked={completedGoals.includes(goal.id)}
                                    onChange={() => toggleGoal(goal.id)}
                                />
                                <span>{goal.label}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="sidebar-card culture-card">
                    <p className="culture-tag">ASL & CULTURE</p>
                    <h2>Language is more than signs</h2>
                    <p>
                        ASL has its own grammar and linguistic structure. Facial
                        expressions, movement, and signing space all contribute
                        to meaning.
                    </p>
                </section>

                <section className="sidebar-card sidebar-card-dark">
                    <h2>Keep going</h2>
                    <p>Every lesson is another step toward communicating in ASL.</p>
                    {!user && (
                        <Link to="/profile">
                            Create an account
                        </Link>
                    )}
                </section>
            </aside>

            {accountDialog?.accountRequired && (
                <div className="learn-modal-backdrop">
                    <section
                        className="learn-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="account-dialog-title"
                    >
                        <button
                            type="button"
                            className="learn-modal-close"
                            aria-label="Close dialog"
                            onClick={() => {
                                setAccountDialog(null);
                                setLockedPreviewUnit(null);
                            }}
                        >
                            ×
                        </button>

                        <p className="lesson-eyebrow">KEEP LEARNING</p>
                        <h2 id="account-dialog-title">
                            {accountDialog.title || 'More ASL lessons'}
                        </h2>
                        <p>
                            Create an account to continue your learning journey and
                            save your lesson progress.
                        </p>

                        <Link to="/profile">Sign in or create an account</Link>

                        <button
                            type="button"
                            onClick={() => {
                                setAccountDialog(null);
                                setLockedPreviewUnit(null);
                            }}
                        >
                            Maybe later
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}