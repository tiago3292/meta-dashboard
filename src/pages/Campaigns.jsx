import { useState } from "react"
import { campaigns as initialCampaigns } from "../data/mockData"
import CampaignTable from "../components/ui/CampaignTable"
import CampaignModal from "../components/ui/CampaignModal"

export default function Campaigns() {

  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [modalState, setModalState] = useState({ open: false, campaign: null })

  const handleNew = () => {
    setModalState({ open: true, campaign: null })
  }

  const handleEdit = (campaign) => {
    setModalState({ open: true, campaign })
  }

  const handleClose = () => {
    setModalState({ open: false, campaign: null })
  }

  const handleSave = (updatedCampaign) => {

    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === updatedCampaign.id)

      if (exists) {
        return prev.map((c) => c.id === updatedCampaign.id ? updatedCampaign : c)
      } else {
        return [...prev, updatedCampaign]
      }
    })

    handleClose()
  }

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return

    setCampaigns((prev) =>
    prev.filter((c) => c.id !== id)
    )
  }

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"}).format(value)

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">Campanhas</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {campaigns.length} Campanha{campaigns.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
          text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Nova Campanha
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Gasto</p>
          <p className="text-white font-bold text-xl">{formatBRL(totalSpent)}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total de Leads</p>
          <p className="text-white font-bold text-xl">{totalLeads}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Campanhas Ativas</p>
          <p className="text-white font-bold text-xl">{activeCampaigns}</p>
        </div>

      </div>

      <CampaignTable
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalState.open && (
        <CampaignModal
          campaign={modalState.campaign}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      
    </div>
  )
}