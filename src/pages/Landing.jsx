
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AvatarCanvas } from '../components/AvatarCanvas';

const ANSWERS = ['A', 'B', 'S'];

function Landing() {
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);

  function resetQuiz() {
    setAnswer('');
    setChecked(false);
  }

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-intro">
          <span className="landing-eyebrow">
            LESSONS FOR INCLUSIVITY
          </span>

          <h1>
            A language you can see.
            <span>A connection you can build.</span>
          </h1>

          <p className="landing-description">
            Discover American Sign Language through guided lessons,
            interactive practice, and a community-centered approach
            to learning.
          </p>

          <div className="landing-actions">
            <Link to="/learn" className="landing-button landing-button-primary">
              Start learning <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#learning-path"
              className="landing-text-link"
            >
              Explore the learning path
            </a>
          </div>

          <p className="landing-note">
            New to ASL? Start with one sign.
          </p>
        </div>

        <section
          className="landing-mini-lesson"
          id="mini-lesson"
          aria-labelledby="mini-lesson-title"
        >
          <div className="mini-lesson-header">
            <div>
              <span className="landing-eyebrow">A LITTLE PRACTICE</span>
              <h2 id="mini-lesson-title">Your first sign starts here.</h2>
            </div>
            <span className="lesson-time">1 question · Beginner</span>
          </div>

          <p className="mini-lesson-description">
            Take a closer look at the handshape. Rotate the model,
            then see if you can identify the letter.
          </p>

          <div className="mini-lesson-layout">
            <div className="mini-lesson-model">
              <AvatarCanvas currentSign="A" />
              <p className="model-hint">
                <span aria-hidden="true">↻</span>
                Drag to explore the handshape
              </p>
            </div>

            <div className="mini-lesson-quiz">
              <span className="quiz-step">QUICK CHECK</span>
              <h3>Which letter is being signed?</h3>

              <div
                className="quiz-answers"
                role="group"
                aria-label="Choose the letter"
              >
                {ANSWERS.map((letter) => {
                  const correct = checked && letter === 'A';
                  const incorrect =
                    checked && answer === letter && letter !== 'A';

                  return (
                    <button
                      key={letter}
                      type="button"
                      className={[
                        'quiz-answer',
                        answer === letter ? 'is-selected' : '',
                        correct ? 'is-correct' : '',
                        incorrect ? 'is-wrong' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => {
                        if (!checked) setAnswer(letter);
                      }}
                      disabled={checked}
                      aria-pressed={answer === letter}
                    >
                      <span className="quiz-answer-letter">{letter}</span>
                      <span>Letter {letter}</span>
                      {correct && <span aria-hidden="true">✓</span>}
                      {incorrect && <span aria-hidden="true">×</span>}
                    </button>
                  );
                })}
              </div>

              {!checked ? (
                <button
                  type="button"
                  className="landing-button landing-button-primary quiz-submit"
                  disabled={!answer}
                  onClick={() => setChecked(true)}
                >
                  Check my answer
                </button>
              ) : (
                <div
                  className={`quiz-feedback ${
                    answer === 'A' ? 'feedback-correct' : 'feedback-incorrect'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <strong>
                    {answer === 'A' ? 'Nice work!' : 'Not quite — keep exploring.'}
                  </strong>
                  <p>
                    The intended answer is A. Look at how the fingers curl
                    and where the thumb rests against the side of the fist.
                  </p>
                  <button type="button" className="quiz-retry" onClick={resetQuiz}>
                    Try again
                  </button>
                </div>
              )}

              <p className="quiz-footnote">
                A small first step toward learning a new language.
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="landing-path" id="learning-path">
        <div className="path-heading">
          <span className="landing-eyebrow">THE JOURNEY</span>
          <h2>Start with the basics. <span>Keep growing.</span></h2>
          <p>
            Learning happens one step at a time. Build a foundation,
            put it into practice, and keep adding to what you know.
          </p>
        </div>

        <div className="learning-stages">
          <article className="learning-stage">
            <span className="stage-number">01</span>
            <div>
              <h3>Discover</h3>
              <p>Meet the alphabet, numbers, and foundational handshapes.</p>
            </div>
          </article>

          <article className="learning-stage">
            <span className="stage-number">02</span>
            <div>
              <h3>Practice</h3>
              <p>Explore signs and test your understanding through activities.</p>
            </div>
          </article>

          <article className="learning-stage">
            <span className="stage-number">03</span>
            <div>
              <h3>Build confidence</h3>
              <p>Revisit what you've learned and continue at your own pace.</p>
            </div>
          </article>
        </div>

        <Link to="/learn" className="path-link">
          Explore the lessons <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="landing-mission" id="about">
        <div className="mission-label">
          <span className="landing-eyebrow">THE REASON BEHIND ASLEARN</span>
          <span className="mission-word" aria-hidden="true">ASL</span>
        </div>

        <div className="mission-copy">
          <h2>Understanding each other should be easier to reach.</h2>
          <p>
            ASL is more than a collection of handshapes. It's a language
            used by over 70 million people. ASLearn began with a simple
            idea: make it easier for more people to take that first step
            toward learning and connecting.
          </p>
          <Link to="/learn" className="landing-button landing-button-secondary">
            Take your first step
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <span>ASLearn</span>
        <span>Learn with curiosity. Connect with care.</span>
      </footer>
    </main>
  );
}

export default Landing;