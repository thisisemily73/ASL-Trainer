import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Sandbox from './pages/Sandbox'
import Vocab from './pages/Vocab'
import Profile from './pages/Profile'

import Topbar from './components/Topbar'
import VocabWordPage from './components/VocabWordPage'
import CameraBox from './components/CameraBox'

function App() {
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
                            <Route path="/vocab/:word" element={<VocabWordPage />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App