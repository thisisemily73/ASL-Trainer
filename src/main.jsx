import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// STYLES
import './styles/Variables.css'
import './styles/Global.css'
import './styles/components/Topbar.css'
import './styles/pages/Learn.css'
import './styles/pages/Sandbox.css'
import './styles/pages/Vocab.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)