// NavLink é como o <a> do HTML, mas inteligente: ele sabe qual rota está ativa
import { NavLink } from "react-router-dom"

// Esses são os ícones que vamos usar — são componentes SVG do próprio Recharts
// Na verdade, vamos usar ícones inline simples para não adicionar dependências
function IconChart() {
  return (
    // viewBox define o sistema de coordenadas interno do SVG
    // fill="currentColor" significa: use a cor do texto do elemento pai
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 12h4v9H3zm7-7h4v16h-4zm7 4h4v12h-4z" />
    </svg>
  )
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z" />
    </svg>
  )
}

export default function Sidebar() {
  // Essa função gera as classes CSS de cada link do menu
  // O React Router passa automaticamente { isActive } para o NavLink
  // quando a rota atual bate com o "to" do link
  const linkClass = ({ isActive }) =>
    [
      // Classes que todo link sempre tem
      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
      // Classes condicionais: muda a cor dependendo se está ativo ou não
      isActive
        ? "bg-orange-400 text-white"           // link da página atual: fundo azul
        : "text-zinc-400 hover:bg-zinc-700 hover:text-white", // outros links
    ].join(" ") // junta tudo em uma string separada por espaço

  return (
    <aside className="h-screen w-42 bg-zinc-800 flex flex-col p-4 gap-2">

      {/* Cabeçalho da sidebar com o nome do app */}
      <div className="px-4 py-3 mb-4">
        {/* text-orange-400 = laranja claro, tracking-wide = espaçamento entre letras */}
        <span className="text-orange-400 font-bold text-lg tracking-wide">
          Meta Dash
        </span>
      </div>

      {/* Links de navegação */}
      {/* end no NavLink do Dashboard evita que "/" case com todas as rotas */}
      <NavLink to="/" end className={linkClass}>
        <IconChart />
        Dashboard
      </NavLink>

      <NavLink to="/campaigns" className={linkClass}>
        <IconList />
        Campanhas
      </NavLink>

    </aside>
  )
}