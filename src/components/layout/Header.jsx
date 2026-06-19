import { useFilter } from "../../context/useFilter"

export default function Header() {

    const { startDate, endDate, updateDates } = useFilter()

    return (
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex
        items-center justify-between px-6">
            
            <h1 className="text-white font-semibold text-base">
                Visão Geral das Campanhas
            </h1>

            <div className="flex items-center gap-3">

                <span className="text-slate-400 text-sm">Período</span>

                <input
                type="date"
                value={startDate}
                onChange={(e) => updateDates(e.target.value, endDate)}
                className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border
                border-slate-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />

                <span className="text-slate-400 text-sm">até</span>

                <input
                type="date"
                value={endDate}
                onChange={(e) => updateDates(startDate, e.target.value)}
                className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border
                border-slate-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />

            </div>
        </header>
    )
}