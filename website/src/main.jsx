import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { StaticInfoProvider } from './context/StaticInfoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <StaticInfoProvider>
        <App />
      </StaticInfoProvider>
    </ThemeProvider>
  </StrictMode>,
)
