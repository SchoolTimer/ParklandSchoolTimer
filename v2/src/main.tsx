import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TVMode } from './features/tv/TVMode.tsx'

const isTV = window.location.pathname === '/tv'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isTV ? <TVMode /> : <App />}
  </StrictMode>,
)
