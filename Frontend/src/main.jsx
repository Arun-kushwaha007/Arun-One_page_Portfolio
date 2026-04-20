import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Remove the HTML-only initial loader once React takes over
const initialLoader = document.getElementById('initial-loader')
if (initialLoader) {
  initialLoader.style.opacity = '0'
  setTimeout(() => initialLoader.remove(), 300)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
