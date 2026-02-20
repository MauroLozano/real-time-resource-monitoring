import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  { StaticDataProvider } from './context/StaticDataProvider'
import { MetricsProvider } from './context/MetricsProvider'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StaticDataProvider>
      <MetricsProvider>
        <App />
      </MetricsProvider>
    </StaticDataProvider>
  </StrictMode>,
)
