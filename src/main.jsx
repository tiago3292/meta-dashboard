import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FilterProvider } from './context/FilterContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode ativa avisos extras do React durante o desenvolvimento
  <StrictMode>
    {/* FilterProvider envolve o App inteiro, então qualquer componente
        dentro da aplicação pode acessar o contexto de filtro */}
    <FilterProvider>
      <App />
    </FilterProvider>
  </StrictMode>,
)