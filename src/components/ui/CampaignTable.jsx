export default function CampaignTable({ campaigns }) {

    const formatBRL = (value) =>
        new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value)

    const formatNumber = (value) =>
        new Intl.NumberFormat("pt-BR").format(value)

    return (
        <div className="overflow-x-auto border border-zinc-700">
            <table className="w-full text-sm">

                <thead>
                    <tr className="bg-zinc-700">
                        {[
                            "Campanha", "Status", "Gasto", "Leads", "Alcance", "CPL"
                        ].map((heading) => (
                            <th
                                key={heading}
                                className="px-4 py-3 text-left text-xs text-zinc-400
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
                                "border-t border-zinc-700 transition-colors hover:bg-zinc-700/50",
                                index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-800/60",
                            ].join(" ")}
                        >

                            <td className="px-3 py-3 text-zinc-300 font-medium">
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

                            <td className="px-4 py-3 text-zinc-300">{formatBRL(campaign.spent)}</td>
                            <td className="px-4 py-3 text-zinc-300">{formatNumber(campaign.leads)}</td>
                            <td className="px-4 py-3 text-zinc-300">{formatNumber(campaign.reach)}</td>
                            <td className="px-4 py-3 text-zinc-300">{formatBRL(campaign.cpl)}</td>
                        
                        </tr>
                    ))}
                </tbody>
                
            </table>
        </div>
    )
}