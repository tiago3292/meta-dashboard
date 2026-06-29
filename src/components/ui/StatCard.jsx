export default function StatCard({ title, value, icon }) {
  // Esse componente recebe três props:
  // - title: o rótulo do card (ex: "Total Gasto")
  // - value: o número formatado para exibir (ex: "R$ 1.200,50")
  // - icon: um emoji ou símbolo visual (ex: "💰")

  return (
    <div className="bg-zinc-800 p-5 border border-zinc-700">

      {/* Linha superior: ícone + título */}
      <div className="flex items-center gap-2 mb-3">
        {/* text-2xl aumenta o tamanho do emoji */}
        <span className="text-2xl">{icon}</span>
        {/* text-zinc-400 = cinza claro, uppercase = caixa alta, tracking-wider = espaçamento */}
        <span className="text-zinc-400 text-xs uppercase tracking-wider font-medium">
          {title}
        </span>
      </div>

      {/* Valor principal do card */}
      {/* text-2xl = fonte grande, font-bold = negrito, text-white = branco */}
      <p className="text-2xl font-bold text-white">{value}</p>

    </div>
  )
}