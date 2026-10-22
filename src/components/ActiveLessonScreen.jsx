import { AvatarCanvas } from './AvatarCanvas';
import CameraBox from './CameraBox';

export default function ActiveLessonScreen({
    unit,
    lessonData,
    activeUnitKey,
    currentSign,
    currentSignIndex,
    theoryIndex,
    setTheoryIndex,
    currentStep,
    setCurrentStep,
    selectedAnswer,
    isCorrect,
    practiceResetKey,
    practiceResult,
    cameraStatus,
    setCameraStatus,
    completionSaving,
    progressMessage,
    handleExitLesson,
    finishLesson,
    handleOptionClick,
    handleContinueToPractice,
    handleSignSubmitted,
    handlePracticeRetry,
    handlePracticeContinue,
    handleSkipCamera,
}) {
    if (!lessonData) return null;

    const concepts = lessonData.content || [];
    const currentConcept = concepts[theoryIndex];
    const isTheory = lessonData.type === 'theory';
    const isLastConcept = theoryIndex === concepts.length - 1;
    const signs = lessonData.signs || [];

    return (
        <div className="learn-page">
            <header className="lesson-header">
                <button
                    type="button"
                    className="lesson-exit-button"
                    onClick={handleExitLesson}
                >
                    Exit lesson
                </button>

                <div className="lesson-header-info">
                    <p>{unit?.title || activeUnitKey}</p>
                    <h1>{lessonData.label}</h1>
                </div>

                <div className="lesson-counter">
                    {isTheory
                        ? `${theoryIndex + 1} / ${concepts.length}`
                        : `${currentSignIndex + 1} / ${signs.length}`}
                </div>
            </header>

            {progressMessage && (
                <p className="progress-message" role="alert">
                    {progressMessage}
                </p>
            )}

            {isTheory ? (
                <section className="theory-lesson">
                    {currentConcept ? (
                        <>
                            <p className="lesson-eyebrow">LEARN THE CONCEPT</p>
                            <h2>{currentConcept.title}</h2>
                            <p>{currentConcept.description}</p>

                            <div className="lesson-navigation">
                                <button
                                    type="button"
                                    disabled={theoryIndex === 0}
                                    onClick={() =>
                                        setTheoryIndex((index) => Math.max(0, index - 1))
                                    }
                                >
                                    Previous
                                </button>

                                {isLastConcept ? (
                                    <button
                                        type="button"
                                        disabled={completionSaving}
                                        onClick={finishLesson}
                                    >
                                        {completionSaving ? 'Saving…' : 'Complete lesson'}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTheoryIndex((index) =>
                                                Math.min(concepts.length - 1, index + 1)
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>No lesson content yet</h2>
                            <p>This lesson needs content before it can be completed.</p>
                        </>
                    )}
                </section>
            ) : currentSign ? (
                <section className="practice-lesson">
                    {currentStep === 'quiz' ? (
                        <>
                            <p className="lesson-eyebrow">RECOGNIZE THE SIGN</p>
                            <h2>Which sign is being shown?</h2>

                            <div className="lesson-avatar">
                                <AvatarCanvas currentSign={currentSign.word} />
                            </div>

                            {currentSign.hint && (
                                <p className="lesson-hint">{currentSign.hint}</p>
                            )}

                            <div className="answer-options">
                                {(currentSign.options || []).map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={
                                            selectedAnswer === option
                                                ? isCorrect
                                                    ? 'answer-option correct'
                                                    : 'answer-option incorrect'
                                                : 'answer-option'
                                        }
                                        onClick={() => handleOptionClick(option)}
                                        disabled={Boolean(selectedAnswer)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {selectedAnswer && (
                                <p
                                    role="status"
                                    className={isCorrect ? 'answer-feedback correct' : 'answer-feedback incorrect'}
                                >
                                    {isCorrect
                                        ? 'Correct! Ready to practice?'
                                        : 'Not quite. Try another answer.'}
                                </p>
                            )}

                            <button
                                type="button"
                                disabled={!isCorrect}
                                onClick={handleContinueToPractice}
                            >
                                Continue to practice
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="lesson-eyebrow">SIGN PRACTICE</p>
                            <h2>Practice: {currentSign.word}</h2>

                            <CameraBox
                                key={practiceResetKey}
                                title="SIGN PRACTICE"
                                height="400px"
                                onSignDetected={setCameraStatus}
                                onSignSubmitted={handleSignSubmitted}
                            />
                            
                            <button
                                type="button"
                                className="skip-camera-button"
                                onClick={handleSkipCamera}
                                disabled={completionSaving}
                            >
                                Skip camera for this lesson
                            </button>

                            {cameraStatus && (
                                <p className="camera-status" role="status">
                                    {typeof cameraStatus === 'string'
                                        ? cameraStatus
                                        : 'Sign detected.'}
                                </p>
                            )}

                            {practiceResult && (
                                <div
                                    className={`practice-feedback ${practiceResult.status === 'correct'
                                            ? 'correct'
                                            : 'incorrect'
                                        }`}
                                    role="status"
                                >
                                    <p>
                                        {practiceResult.status === 'correct'
                                            ? 'Nice work!'
                                            : practiceResult.message || 'Not quite. Try again.'}
                                    </p>

                                    {practiceResult.status === 'correct' ? (
                                        <button
                                            type="button"
                                            onClick={handlePracticeContinue}
                                            disabled={completionSaving}
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
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
                <section className="lesson-empty-state">
                    <h2>This lesson isn't ready yet</h2>
                    <p>There are no signs available in this lesson yet.</p>
                    <button type="button" onClick={handleExitLesson}>
                        Return to lessons
                    </button>
                </section>
            )}
        </div>
    );
}