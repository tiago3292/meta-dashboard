import { NavLink } from "react-router-dom"

function IconChart() {
    return(
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

    const linkClass = ({ isActive }) =>
        [
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive
            ? "gb-blue-600 text-white"
            : "text-slate-400 hover:bg-slate-700 hover:text-white"
        ].join(" ")
    
    return (
        <aside className="h-screen w-45 bg-slate-800 flex flex-col p-4 gap-2">
            
            <div className="px-4 py-3 mb-4">
                <span className="text-blue-400 font-bold text-lg tracking-wide">
                    Meta Dash
                </span>
            </div>
            
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