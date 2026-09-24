import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/Variables.css'
import './styles/Global.css'
import './styles/pages/Learn.css'
import './styles/pages/Sandbox.css'
import './styles/pages/Vocab.css'
import './styles/pages/Profile.css'

import './styles/components/Topbar.css'
import './styles/components/VocabWordPage.css'
import './styles/components/CameraBox.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)