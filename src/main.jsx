import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FilterProvider } from './context/FilterContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FilterProvider>
      <App />
    </FilterProvider>
  </StrictMode>,
)