import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { useAuth } from './context/AuthContext'

import Topbar from './components/Topbar'

import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Sandbox from './pages/Sandbox'
import Vocab from './pages/Vocab'
import Profile from './pages/Profile'

function App() {

  // Temporarily bypass auth for testing purposes. Uncomment the following lines to enable authentication checks.
    // const { user, loading } = useAuth()

    // if (loading) {
    //     return null
    // }

    // if (!user) {
    //     return <Auth />
    // }

    return (
        <BrowserRouter>
            <div className="app">
                <div className="app-main">
                    <Topbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Learn />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/sandbox" element={<Sandbox />} />
                            <Route path="/vocab" element={<Vocab />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App