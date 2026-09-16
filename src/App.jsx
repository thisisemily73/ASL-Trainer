import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import Home from './pages/Dashboard'
import Lessons from './pages/Lessons'
import Sandbox from './pages/Sandbox'
import Vocab from './pages/Vocab'
import Settings from './pages/Settings'


import SubjectDetails from "./pages/SubjectDetails"

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
                <Sidebar />
                <div className="app-main">
                    <Topbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/lessons" element={<Lessons />} />
                            <Route path="/sandbox" element={<Sandbox />} />
                            <Route path="/vocab" element={<Vocab />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App