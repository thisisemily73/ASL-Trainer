function Learn() {
  return (
    <div className="page learn-content-grid">
      {/* Main Learning Path Area */}
      <main className="path-main-immersive">

        <div className="unit-banner">
          <h2>UNIT 1: FUNDAMENTALS</h2>
        </div>

        <div className="path-container">
          {/* Expanded SVG viewBox to match the exact vertical height of the nodes */}
          <svg className="path-svg" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 90 50 C 90 130, 210 130, 210 210 C 210 300, 90 300, 90 360"
              stroke="var(--border-color, #CBD5E1)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          <div className="path-nodes">
            {/* Node 1: Left */}
            <div className="node-wrapper node-left completed">
              <div className="node-circle">A</div>
              <span className="node-label">ALPHABET PART 1</span>
              <span className="node-status">✓ COMPLETED</span>
            </div>

            {/* Node 2: Right */}
            <div className="node-wrapper node-right completed">
              <div className="node-circle">5</div>
              <span className="node-label">NUMBERS 1-10</span>
              <span className="node-status">✓ COMPLETED</span>
            </div>

            {/* Node 3: Left (Active) */}
            <div className="node-wrapper node-left active">
              <div className="node-circle active-circle">👋</div>
              <span className="node-label">BASIC GREETINGS</span>
              <span className="node-status active-text">IN PROGRESS</span>
              <button className="start-btn">START LESSON</button>
            </div>

            {/* Node 4: Right (Locked) */}
            <div className="node-wrapper node-right locked">
              <div className="node-circle">👥</div>
              <span className="node-label">FAMILY & PEOPLE</span>
              <span className="node-status">LOCKED</span>
            </div>
          </div>
        </div>

      </main>

      {/* Sidebar */}
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
  )
}

export default Learn;