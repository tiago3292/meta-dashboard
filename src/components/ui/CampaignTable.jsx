export default function CampaignTable({ campaigns, onEdit, onDelete }) {
  // Esse componente recebe três props:
  // - campaigns: o array de campanhas para exibir
  // - onEdit: função chamada quando o usuário clica em "Editar"
  // - onDelete: função chamada quando o usuário clica em "Excluir"

  // Formata número como moeda brasileira
  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Formata número com separador de milhar
  const formatNumber = (value) =>
    new Intl.NumberFormat("pt-BR").format(value)

  return (
    // overflow-x-auto permite scroll horizontal em telas pequenas
    // para a tabela não "quebrar" o layout
    <div className="overflow-x-auto border border-zinc-700">
      <table className="w-full text-sm">

        {/* Cabeçalho da tabela */}
        <thead>
          <tr className="bg-zinc-700">
            {/* text-left = alinha o texto à esquerda */}
            {/* uppercase + tracking-wider = estilo de cabeçalho profissional */}
            {[
              "Campanha", "Status", "Gasto", "Leads", "Alcance", "CPL", "Ações"
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 text-left text-xs text-zinc-400 uppercase tracking-wider font-medium"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        {/* Corpo da tabela */}
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr
              key={campaign.id}
              className={[
                "border-t border-zinc-700 transition-colors hover:bg-zinc-700/50",
                // Alterna a cor de fundo das linhas para facilitar a leitura
                // index % 2 === 0 é true para índices pares (0, 2, 4...)
                index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-800/60",
              ].join(" ")}
            >

              {/* Nome da campanha */}
              <td className="px-4 py-3 text-white font-medium">
                {campaign.name}
              </td>

              {/* Badge de status: muda de cor dependendo se está ativa ou pausada */}
              <td className="px-4 py-3">
                <span className={[
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  campaign.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-400" // verde para ativa
                    : "bg-yellow-500/20 text-yellow-400",  // amarelo para pausada
                ].join(" ")}>
                  {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
                </span>
              </td>

              {/* Dados numéricos */}
              <td className="px-4 py-3 text-zinc-300">{formatBRL(campaign.spent)}</td>
              <td className="px-4 py-3 text-zinc-300">{formatNumber(campaign.leads)}</td>
              <td className="px-4 py-3 text-zinc-300">{formatNumber(campaign.reach)}</td>
              <td className="px-4 py-3 text-zinc-300">{formatBRL(campaign.cpl)}</td>

              {/* Botões de ação */}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(campaign)}
                    // Passamos a campanha inteira para o onEdit
                    // O componente pai vai receber e abrir o modal com esses dados
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 text-xs font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(campaign.id)}
                    // Passamos só o id para o onDelete, que é tudo que precisamos
                    // para remover a campanha do array
                    className="px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs font-medium transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}