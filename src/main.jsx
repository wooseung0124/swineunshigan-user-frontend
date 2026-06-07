import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import App from './App.jsx'
import { captureFromUrl } from './utils/personality'

captureFromUrl()

createRoot(document.getElementById('root')).render(
    <App />
)
