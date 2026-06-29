// NavLink é um <a> do HTML que sabe qual rota está ativa
import { NavLink } from "react-router-dom"

// Ícones inline simples para evitar adição de dependências.
// são componentes SVG do próprio Recharts.
function IconChart() {
    return(
        // viewBox define o sistema de coordenadas interno do SVG
        // fill="currentColor" = "use a cor do texto do elemento pai"
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
            // Classes que todo link tem
            "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
            // Classes condicionais que muda a cor dependendo se está ativo ou não
            isActive
            ? "gb-blue-600 text-zinc-300" // Link da página atual
            : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300" // Outros links
        ].join(" ")
    
    return (
        <aside className="h-screen w-38 bg-zinc-800/60 flex flex-col py-2 gap-2">
            
            {/* Cabeçalho da sidebar */}
            <div className="px-4 py-3 mb-4">
                <span className="text-orange-400 font-bold text-lg tracking-wide">
                    Meta Dash
                </span>
            </div>
            
            {/* Links de navegação */}
            {/* end no NavLink evita que "/" case com todas as rotas */}
            <NavLink to="/" end className={linkClass}>
                <IconChart />
                Dashboard
            </NavLink>

            <NavLink to="/campaings" className={linkClass}>
                <IconList />
                Campanhas
            </NavLink>
            
        </aside>
    )
}