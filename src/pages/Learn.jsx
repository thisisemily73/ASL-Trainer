import useLearn from '../services/useLearn';
import LearnScreen from '../components/LearnScreen';
import ActiveLessonScreen from '../components/ActiveLessonScreen';

export default function Learn() {
  const learn = useLearn();

  // Wait for authentication and saved progress to finish loading.
  if (learn.authLoading || learn.progressLoading) {
    return (
      <div className="page learn-content-grid">
        <main className="path-main-immersive">
          <p>Loading your learning path...</p>
        </main>
      </div>
    );
  }

  // Let the user retry if saved progress fails to load.
  if (learn.progressLoadFailed) {
    return (
      <div className="page learn-content-grid">
        <main className="path-main-immersive">
          <section className="sidebar-card">
            <h1>Couldn't load your progress</h1>
            <p>
              Your learning progress couldn't be loaded.
              Check your connection and try again.
            </p>

            <button
              type="button"
              onClick={learn.retryProgressLoad}
            >
              Try again
            </button>
          </section>
        </main>
      </div>
    );
  }

  // Render the active lesson when one is selected.
  if (learn.activeLesson && learn.lessonData) {
    return <ActiveLessonScreen {...learn} />;
  }

  // Otherwise, render the lesson path and sidebar.
  return <LearnScreen {...learn} />;
}