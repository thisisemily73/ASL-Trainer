
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { lessonPath } from '../data/lessons/lessonPath';

import {
    getCompletedLessons,
    completeLesson,
} from '../services/lessonProgress';

import { evaluatePractice } from '../utils/practice/practiceLogic';

export const INITIAL_GOALS = [
    { id: 'signs', label: 'Learn 5 Signs Today' },
    { id: 'practice', label: 'Practice 15 Mins' },
    { id: 'unit', label: 'Complete Unit 1' },
];

export const lessonKey = (unitKey, lessonId) =>
    `${unitKey}:${lessonId}`;

export default function useLearn() {
    const { user, loading: authLoading } = useAuth();

    // Unit navigation
    const [activeUnitKey, setActiveUnitKey] = useState('prologue');
    const [showUnitSelector, setShowUnitSelector] = useState(false);
    const [lockedPreviewUnit, setLockedPreviewUnit] = useState(null);

    // Active lesson
    const [activeLesson, setActiveLesson] = useState(null);
    const [currentSignIndex, setCurrentSignIndex] = useState(0);
    const [theoryIndex, setTheoryIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState('quiz');

    // Saved progress
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progressLoading, setProgressLoading] = useState(true);
    const [progressLoadFailed, setProgressLoadFailed] = useState(false);
    const [completionSaving, setCompletionSaving] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [progressRetryKey, setProgressRetryKey] = useState(0);

    // Quiz
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    // Practice
    const [practiceResetKey, setPracticeResetKey] = useState(0);
    const [practiceResult, setPracticeResult] = useState(null);
    const [cameraStatus, setCameraStatus] = useState('');

    // Session-only goals
    const [completedGoals, setCompletedGoals] = useState(['signs']);

    // Dialogs
    const [accountDialog, setAccountDialog] = useState(null);

    // Load the signed-in user's saved lesson progress.
    useEffect(() => {
        let cancelled = false;

        async function loadProgress() {
            if (authLoading) return;

            setProgressLoading(true);
            setProgressLoadFailed(false);

            if (!user) {
                setCompletedLessons([]);
                setProgressLoading(false);
                return;
            }

            try {
                const savedLessons = await getCompletedLessons(user.uid);

                if (!cancelled) {
                    setCompletedLessons(savedLessons);
                }
            } catch (error) {
                console.error('Failed to load lesson progress:', error);

                if (!cancelled) {
                    setProgressLoadFailed(true);
                }
            } finally {
                if (!cancelled) {
                    setProgressLoading(false);
                }
            }
        }

        loadProgress();

        return () => {
            cancelled = true;
        };
    }, [user, authLoading, progressRetryKey]);

    // Lesson data
    const availableUnits = Object.entries(lessonPath).map(
        ([key, value]) => ({
            key,
            ...value,
        })
    );

    const unit = lessonPath[activeUnitKey];
    const lessons = unit?.lessons || [];

    const lessonData =
        lessons.find((lesson) => lesson.id === activeLesson) || null;

    const currentSign =
        lessonData?.signs?.[currentSignIndex] || null;

    const isLessonCompleted = useCallback(
        (unitKey, lessonId) =>
            completedLessons.includes(lessonKey(unitKey, lessonId)),
        [completedLessons]
    );

    const getLessonState = useCallback(
        (lesson, index) => {
            if (isLessonCompleted(activeUnitKey, lesson.id)) {
                return 'completed';
            }

            if (
                index === 0 ||
                isLessonCompleted(activeUnitKey, lessons[index - 1]?.id)
            ) {
                return 'available';
            }

            return 'locked';
        },
        [activeUnitKey, isLessonCompleted, lessons]
    );

    const completedCount = lessons.filter((lesson) =>
        isLessonCompleted(activeUnitKey, lesson.id)
    ).length;

    const unitProgress = lessons.length
        ? Math.round((completedCount / lessons.length) * 100)
        : 0;

    // Reset lesson-specific state when leaving or starting a lesson.
    const resetLessonState = useCallback(() => {
        setActiveLesson(null);
        setCurrentSignIndex(0);
        setTheoryIndex(0);
        setCurrentStep('quiz');
        setSelectedAnswer('');
        setIsCorrect(false);
        setPracticeResult(null);
        setCameraStatus('');
        setPracticeResetKey((key) => key + 1);
    }, []);

    const promptForAccount = useCallback(
        (title = 'More ASL lessons') => {
            setAccountDialog({
                accountRequired: true,
                title,
                lessons: [],
            });
        },
        []
    );

    const handleSelectUnit = useCallback(
        (unitKey) => {
            if (
                !lessonPath[unitKey] ||
                progressLoading ||
                progressLoadFailed
            ) {
                return;
            }

            if (!user && unitKey !== 'prologue') {
                promptForAccount('Unlock more ASL lessons');
                return;
            }

            setActiveUnitKey(unitKey);
            resetLessonState();
            setShowUnitSelector(false);
            setLockedPreviewUnit(null);
            setAccountDialog(null);
            setProgressMessage('');
        },
        [
            user,
            progressLoading,
            progressLoadFailed,
            promptForAccount,
            resetLessonState,
        ]
    );

    const handleStartLesson = useCallback(
        (lessonId, index) => {
            if (
                progressLoading ||
                progressLoadFailed ||
                completionSaving
            ) {
                return;
            }

            // Guests may preview only the first Prologue lesson.
            if (
                !user &&
                (activeUnitKey !== 'prologue' || index !== 0)
            ) {
                promptForAccount('Create an account to continue learning');
                return;
            }

            setActiveLesson(lessonId);
            setCurrentSignIndex(0);
            setTheoryIndex(0);
            setCurrentStep('quiz');
            setSelectedAnswer('');
            setIsCorrect(false);
            setPracticeResult(null);
            setCameraStatus('');
            setPracticeResetKey((key) => key + 1);
            setProgressMessage('');
            setAccountDialog(null);
        },
        [
            user,
            activeUnitKey,
            progressLoading,
            progressLoadFailed,
            completionSaving,
            promptForAccount,
        ]
    );

    const handleExitLesson = useCallback(() => {
        resetLessonState();
        setProgressMessage('');
    }, [resetLessonState]);

    const finishLesson = useCallback(async () => {
        if (
            !activeLesson ||
            completionSaving ||
            progressLoading ||
            progressLoadFailed
        ) {
            return;
        }

        const key = lessonKey(activeUnitKey, activeLesson);

        setCompletionSaving(true);
        setProgressMessage('');

        try {
            if (user) {
                await completeLesson(user.uid, activeUnitKey, activeLesson);
            }

            setCompletedLessons((previous) =>
                previous.includes(key) ? previous : [...previous, key]
            );

            resetLessonState();
        } catch (error) {
            console.error('Failed to save lesson completion:', error);
            setProgressMessage(
                'Your lesson could not be saved. Please try again.'
            );
        } finally {
            setCompletionSaving(false);
        }
    }, [
        activeLesson,
        activeUnitKey,
        completionSaving,
        progressLoading,
        progressLoadFailed,
        user,
        resetLessonState,
    ]);

    // Quiz and practice handlers
    const handleOptionClick = useCallback(
        (option) => {
            if (!currentSign) return;

            setSelectedAnswer(option);
            setIsCorrect(option === currentSign.correctAnswer);
        },
        [currentSign]
    );

    const handleContinueToPractice = useCallback(() => {
        if (!isCorrect) return;

        setCurrentStep('practice');
        setPracticeResult(null);
        setCameraStatus('');
        setPracticeResetKey((key) => key + 1);
    }, [isCorrect]);

    const handleSignSubmitted = useCallback(
        (detection, alternatives) => {
            if (!currentSign) return;

            const result = evaluatePractice(currentSign.word, detection);

            console.log('Practice evaluation:', {
                target: currentSign.word,
                detection,
                alternatives,
                result,
            });

            setPracticeResult(result);
        },
        [currentSign]
    );

    const handlePracticeRetry = useCallback(() => {
        setPracticeResult(null);
        setCameraStatus('');
        setPracticeResetKey((key) => key + 1);
    }, []);

    const handlePracticeComplete = useCallback(() => {
        const signs = lessonData?.signs || [];

        if (currentSignIndex < signs.length - 1) {
            setCurrentSignIndex((index) => index + 1);
            setCurrentStep('quiz');
            setSelectedAnswer('');
            setIsCorrect(false);
            setPracticeResult(null);
            setCameraStatus('');
            setPracticeResetKey((key) => key + 1);
            return;
        }

        finishLesson();
    }, [lessonData, currentSignIndex, finishLesson]);

    const handlePracticeContinue = useCallback(() => {
        if (practiceResult?.status !== 'correct') return;

        setPracticeResult(null);
        handlePracticeComplete();
    }, [practiceResult, handlePracticeComplete]);

    const toggleGoal = useCallback((goalId) => {
        setCompletedGoals((previous) =>
            previous.includes(goalId)
                ? previous.filter((id) => id !== goalId)
                : [...previous, goalId]
        );
    }, []);

    const retryProgressLoad = useCallback(() => {
        setProgressRetryKey((key) => key + 1);
    }, []);

    const handleSkipCamera = useCallback(() => {
        setPracticeResult(null);
        setCameraStatus('');
        setSelectedAnswer('');
        setIsCorrect(false);

        handlePracticeComplete();
    }, [handlePracticeComplete]);

    return {
        // Auth
        user,
        authLoading,

        // Unit navigation
        activeUnitKey,
        setActiveUnitKey,
        showUnitSelector,
        setShowUnitSelector,
        lockedPreviewUnit,
        setLockedPreviewUnit,
        availableUnits,

        // Lesson data
        unit,
        lessons,
        lessonData,
        activeLesson,
        currentSign,
        currentSignIndex,
        theoryIndex,
        setTheoryIndex,
        currentStep,
        setCurrentStep,

        // Progress
        completedLessons,
        progressLoading,
        progressLoadFailed,
        completionSaving,
        progressMessage,
        setProgressMessage,
        completedCount,
        unitProgress,
        isLessonCompleted,
        getLessonState,
        retryProgressLoad,

        // Quiz
        selectedAnswer,
        isCorrect,

        // Practice
        practiceResetKey,
        practiceResult,
        cameraStatus,
        setCameraStatus,

        // Goals and dialogs
        completedGoals,
        toggleGoal,
        accountDialog,
        setAccountDialog,

        // Actions
        handleSelectUnit,
        handleStartLesson,
        handleExitLesson,
        finishLesson,
        handleOptionClick,
        handleContinueToPractice,
        handleSignSubmitted,
        handlePracticeRetry,
        handlePracticeComplete,
        handlePracticeContinue,
        handleSkipCamera,
        promptForAccount,
        resetLessonState,
    };
}