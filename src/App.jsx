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

      {/* flex = coloca sidebar e conteúdo lado a lado */}
      {/* h-screen = ocupa a altura total da tela */}
      {/* bg-zinc-900 = fundo escuro para a área de conteúdo */}
      <div className="flex h-screen bg-zinc-900">

        {/* Sidebar fica fixo à esquerda */}
        <Sidebar />

        {/* flex-1 = ocupa todo o espaço restante após a sidebar */}
        {/* flex-col = empilha header e conteúdo verticalmente */}
        {/* overflow-hidden = evita scroll duplo */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header fica fixo no topo da área de conteúdo */}
          <Header />

          {/* main ocupa o espaço restante e permite scroll interno */}
          <main className="flex-1 overflow-y-auto p-6">

            {/* Routes analisa a URL atual e renderiza apenas a Route correspondente */}
            <Routes>
              {/* Quando a URL for "/", renderiza o Dashboard */}
              <Route path="/" element={<Dashboard />} />
              {/* Quando a URL for "/campaigns", renderiza Campaigns */}
              <Route path="/campaigns" element={<Campaigns />} />
            </Routes>

          </main>
        </div>
      </div>

    </BrowserRouter>
  )
}