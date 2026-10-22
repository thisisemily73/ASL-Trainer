
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar() {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <Link to={user ? '/learn' : '/'} className="logo">
                    ASLearn
                </Link>
            </div>

            <div className="topbar-right">
                {user ? (
                    // Logged in
                    <nav className="links">
                        <Link to="/learn">Learn</Link>
                        <Link to="/sandbox">Sandbox</Link>
                        {/* <Link to="/vocab">Vocabulary</Link> */}
                        <Link to="/profile">Profile</Link>
                    </nav>
                ) : (
                    // Logged out
                    <nav className="links">
                        <Link to="/profile">Log In</Link>
                        <Link to="/profile" className="get-started">
                            Get Started
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Topbar;