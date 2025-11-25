import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import EnteProfile from './pages/EnteProfile.jsx'
import BeneficiarioProfile from './pages/BeneficiarioProfile.jsx'
import Raccoltafondi from './pages/Raccoltafondi.jsx'
import StoriesBoard from './pages/StoriesBoard.jsx'
import VolontarioProfile from './pages/VolontarioProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
      <LoginPage/>
    </BrowserRouter>
  </StrictMode>,
)