
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div className="landing-page">
            <section className="landing-hero">
                <div className="landing-copy">
                    <span className="landing-eyebrow">
                        A NEW WAY TO LEARN ASL
                    </span>

                    <h1>
                        A language you can see.
                        <span> A skill you can build.</span>
                    </h1>

                    <p className="landing-description">
                        Learn American Sign Language through guided lessons,
                        interactive practice, and a learning experience built
                        around real progress.
                    </p>

                    <div className="landing-actions">
                        <Link to="/learn" className="landing-button landing-button-primary">
                            Start learning
                        </Link>

                        <Link to="/learn" className="landing-button landing-button-secondary">
                            Explore lessons
                        </Link>
                    </div>

                    <p className="landing-note">
                        New to ASL? No experience needed.
                    </p>
                </div>


                <div className="landing-visual-panel">
                    <span className="landing-visual-label">YOUR ASL JOURNEY</span>

                    <div className="landing-visual-content">
                        <div className="landing-visual-icon">
                            <span aria-hidden="true">A</span>
                            <span aria-hidden="true">↔</span>
                            <span aria-hidden="true">Z</span>
                        </div>

                        <h2>Learn at your own pace.</h2>

                        <p>
                            Start with the basics, practice what you learn,
                            and build your skills one lesson at a time.
                        </p>
                    </div>

                    <div className="landing-visual-footer">
                        <span className="landing-status-dot" />
                        Your journey starts here
                    </div>
                </div>

            </section>

            <section className="landing-features">
                <div className="landing-section-heading">
                    <span className="landing-eyebrow">LEARN YOUR WAY</span>
                    <h2>More than memorizing signs.</h2>
                    <p>
                        Build your understanding through practice, exploration,
                        and lessons that meet you where you are.
                    </p>
                </div>

                <div className="landing-feature-grid">
                    <article className="landing-feature">
                        <span className="landing-feature-number">01</span>
                        <h3>Guided lessons</h3>
                        <p>
                            Work through structured units and learn signs
                            step by step.
                        </p>
                    </article>

                    <article className="landing-feature">
                        <span className="landing-feature-number">02</span>
                        <h3>Interactive practice</h3>
                        <p>
                            Put your knowledge to work with hands-on signing
                            activities and practice tools.
                        </p>
                    </article>

                    <article className="landing-feature">
                        <span className="landing-feature-number">03</span>
                        <h3>Your own progress</h3>
                        <p>
                            Build confidence over time and keep track of
                            what you learn.
                        </p>
                    </article>
                </div>
            </section>

            <section className="landing-bottom-cta">
                <div>
                    <h2>Ready to get started?</h2>
                    <p>Your ASL learning journey starts with one sign.</p>
                </div>

                <Link to="/learn" className="landing-button landing-button-primary">
                    Start learning
                </Link>
            </section>
        </div>
    );
}

export default Landing;