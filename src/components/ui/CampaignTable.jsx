export default function CampaignTable({ campaigns, onEdit, onDelete }) {

    const formatBRL = (value) =>
        new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value)

    const formatNumber = (value) =>
        new Intl.NumberFormat("pt-BR").format(value)

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm">

                <thead>
                    <tr className="bg-slate-700">
                        {[
                            "Campanha", "Status", "Gasto", "Leads", "Alcance", "CPL", "Ações"
                        ].map((heading) => (
                            <th
                                key={heading}
                                className="px-4 py-3 text-left text-xs text-slate-400
                                uppercase tracking-wider font-medium"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {campaigns.map((campaign, index) => (
                        <tr
                            key={campaign.id}
                            className={[
                                "border-t border-slate-700 transition-colors hover:bg-slate-700/50",
                                index % 2 === 0 ? "bg-slate-800" : "bg-slate-800/60",
                            ].join(" ")}
                        >

                            <td className="px-3 py-3 text-white font-medium">
                                {campaign.name}
                            </td>

                            <td className="px-4 py-3">
                                <span className={[
                                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                                    campaign.status === "ACTIVE"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-yellow-500/20 text-yellow-400",
                                ].join(" ")}>
                                    {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-slate-300">{formatBRL(campaign.spent)}</td>
                            <td className="px-4 py-3 text-slate-300">{formatNumber(campaign.leads)}</td>
                            <td className="px-4 py-3 text-slate-300">{formatNumber(campaign.reach)}</td>
                            <td className="px-4 py-3 text-slate-300">{formatBRL(campaign.cpl)}</td>

                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(campaign)}
                                        className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400
                                            hover:bg-blue-600/40 text-xs font-medium transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(campaign.id)}
                                        className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400
                                            hover:bg-red-600/40 text-xs font-medium transition-colors"
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