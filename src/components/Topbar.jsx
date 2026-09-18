function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <a href="/" className="logo">ASL Hand Trainer</a>
            </div>
            <div className="topbar-right">

                <span className="links">
                    <a href="/">Learn</a>
                    <a href="/sandbox">Sandbox</a>
                    <a href="/vocab">Vocabulary</a>
                    <a href="/profile">Profile</a>
                </span>

            </div>

        </header>
    )
}

export default Topbar