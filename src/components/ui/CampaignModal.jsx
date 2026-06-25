import { parseISOWithOptions } from "date-fns/fp"
import { useState, useEffect } from "react"

export default function CampaignModal({ campaign }) {

    const [formData, setFormData] = useState({
        name: "",
        status: "ACTIVE",
        spent: "",
        leads: "",
        reach: "",
    })

    useEffect(() => {
        if (campaign) {
            setFormData({
                name: campaign.name,
                status: campaign.status,
                spent: campaign.spent,
                leads: campaign.leads,
                reach: campaign.reach,
            })
        }
    }, [campaign])

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }))
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-md border border-zinc-700">

                <h2 className="text-zinc-300 font-semibold text-lg mb-4">
                    {campaign ? "Editar Campanha" : "Nova Campanha"}
                </h2>

                <div className="flex flex-col gap-4">

                    <div>
                        <label className="text-zinc-400 text-sm block mb-1">Nome</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleChange("name")}
                            className="w-full bg-zinc 700 text-zinc-300 rounded-lg px-3 py-2
                            border border-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-zinc-400 text-sm block mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={handleChange("status")}
                            className="w-full bg-zinc 700 text-zinc-300 rounded-lg px-3 py-2
                            border border-zinc-600 focus:outline-none focus:border-blue-500"
                        >
                            <option value="ACTIVE">Ativa</option>
                            <option value="PAUSED">Pausada</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-zinc-400 text-sm block mb-1">Valor Gasto (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.spent}
                            onChange={handleChange("spent")}
                            className="w-full bg-zinc 700 text-zinc-300 rounded-lg px-3 py-2
                            border border-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-zinc-400 text-sm mb-1">Leads</label>
                        <input
                            type="number"
                            value={formData.leads}
                            onChange={handleChange("leads")}
                            className="w-full bg-zinc 700 text-zinc-300 rounded-lg px-3 py-2
                            border border-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-zinc-400 text-sm block mb-1">Alcance</label>
                        <input
                            type="number"
                            value={formData.reach}
                            onChange={handleChange("reach")}
                            className="w-full bg-zinc 700 text-zinc-300 rounded-lg px-3 py-2
                            border border-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}