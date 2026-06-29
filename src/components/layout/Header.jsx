// Importamos o hook personalizado que criamos na etapa anterior
import { useFilter } from "../../context/useFilter"

export default function Header() {
  // Acessamos as datas e a função de atualização direto do contexto
  // Sem prop drilling: não precisamos receber nada via props
  const { startDate, endDate, updateDates } = useFilter()

  return (
    // justify-between = empurra os elementos para as extremidades
    // border-b = linha separadora embaixo do header
    <header className="h-16 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-6">

      <h1 className="text-white font-semibold text-base">
        Visão Geral das Campanhas
      </h1>

      {/* Controles de filtro de data */}
      <div className="flex items-center gap-3">

        <span className="text-zinc-400 text-sm">Período:</span>

        {/* Input de data inicial */}
        <input
          type="date"
          value={startDate}
          // onChange é chamado toda vez que o usuário muda a data
          // e.target.value é o novo valor digitado
          onChange={(e) => updateDates(e.target.value, endDate)}
          // [color-scheme:dark] faz o calendário nativo do browser usar tema escuro
          className="bg-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 border border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
        />

        <span className="text-zinc-400 text-sm">até</span>

        {/* Input de data final */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => updateDates(startDate, e.target.value)}
          className="bg-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 border border-zinc-600 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
        />

      </div>
    </header>
  )
}