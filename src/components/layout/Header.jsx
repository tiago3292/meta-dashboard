// Importando hook personalizado
import { useFilter } from "../../context/useFilter"

export default function Header() {

    // Acessa as datas e funcão de atualização direto do contexto
    // sem prop drilling
    const { startDate, endDate, updateDates } = useFilter()

    return (
        <header className="h-16 bg-zinc-800 border-b border-zinc-700 flex
        items-center justify-between px-6">
            
            <h1 className="text-zinc-300 font-semibold text-base leading-tight">
                Visão Geral das Campanhas
            </h1>

            <div className="flex items-center gap-3">

                {/*<span className="text-zinc-400 text-sm">Período</span>*/}

                <input
                type="date"
                value={startDate}
                // onChange é chamado toda vez que o usuário muda a data
                // e.target.value é o novo valor digitado
                onChange={(e) => updateDates(e.target.value, endDate)}
                className="bg-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border
                border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />

                <span className="text-zinc-400 text-sm">até</span>

                <input
                type="date"
                value={endDate}
                onChange={(e) => updateDates(startDate, e.target.value)}
                className="bg-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border
                border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />

            </div>
        </header>
    )
}