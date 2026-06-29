// BrowserRouter gerencia o histórico de navegação do browser
// Routes é o container de todas as rotas
// Route define cada rota individualmente
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import Campaigns from "./pages/Campaigns"

export default function App() {
  return (
    // BrowserRouter precisa envolver tudo que usa navegação
    <BrowserRouter>

    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {/* main ocupa o espaço restante e permite scroll interno */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Routes analisa a URL atual e renderiza apenas a Route correspondente */}
          <Routes>
            {/* Quando a URL for "/", renderiza o Dashboard */}
            <Route path="/" element={<Dashboard />} />
            {/* Quando a URL for "/campaigns", renderiza Campaigns */}
            <Route path="/campaings" element={<Campaigns />} />
          </Routes>
        </main>
      </div>
    </div>

    </BrowserRouter>
  )
}