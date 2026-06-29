import { useState, useEffect } from "react"
import { useFilter } from "../context/useFilter"
import { fetchCampaigns, fetchAllInsights, normalizeInsights } from "../services/metaApi"
import CampaignTable from "../components/ui/CampaignTable"

export default function Campaigns() {
  const { startDate, endDate } = useFilter()

  const [campaigns, setCampaigns]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        // Faz duas chamadas em paralelo:
        // 1. fetchCampaigns > traz id, name e status de cada campanha
        // 2. fetchAllInsights > traz as métricas do período selecionado
        // Promise.all espera as DUAS terminarem antes de continuar
        // Isso é mais rápido do que fazer uma chamada de cada vez
        const [rawCampaigns, rawInsights] = await Promise.all([
          fetchCampaigns(),
          fetchAllInsights(startDate, endDate),
        ])

        // Normalizamos os insights em um mapa para busca rápida por id
        const insightsMap = normalizeInsights(rawInsights).reduce((map, c) => {
          map[c.id] = c
          return map
        }, {})
        // .reduce() transforma o array em um objeto { [id]: campanha }
        // Isso permite buscar os dados de uma campanha pelo id em O(1)
        // em vez de percorrer o array inteiro a cada vez

        // Agora montamos a lista final a partir de TODAS as campanhas
        // independente de terem tido veiculação no período ou não
        const withMetrics = rawCampaigns.map((campaign) => {
          // Buscamos os insights dessa campanha no mapa
          const insights = insightsMap[campaign.id]

          // Se não houver insights no período, usamos zeros
          return {
            id:       campaign.id,
            name:     campaign.name,
            status:   campaign.status,
            spent:    insights?.spent  ?? 0,
            leads:    insights?.leads  ?? 0,
            reach:    insights?.reach  ?? 0,
            cpl:      insights?.cpl    ?? 0,
            dailyData: insights?.dailyData ?? [],
          }
        })

        // Ordenamos: campanhas com gasto primeiro, depois por nome
        withMetrics.sort((a, b) => {
          if (b.spent !== a.spent) return b.spent - a.spent
          return a.name.localeCompare(b.name)
        })

        setCampaigns(withMetrics)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [startDate, endDate])



  const handleSave = (updatedCampaign) => {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === updatedCampaign.id)
      if (exists) {
        return prev.map((c) => c.id === updatedCampaign.id ? updatedCampaign : c)
      }
      return [...prev, updatedCampaign]
    })
    handleClose()
  }

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  // Totais para os cards de resumo
  const totalSpent      = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const totalLeads      = campaigns.reduce((acc, c) => acc + c.leads, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Buscando campanhas do Meta Ads...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 font-medium">Erro ao buscar campanhas</p>
        <p className="text-zinc-400 text-sm text-center max-w-md">{error}</p>
      </div>
    )
  }

  // Renderização principal
  return (
    <div className="flex flex-col gap-6">

      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-zinc-300 font-bold text-xl">Campanhas</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {campaigns.length} campanha{campaigns.length !== 1 ? "s" : ""} no período
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Gasto</p>
          <p className="text-zinc-300 font-bold text-xl">{formatBRL(totalSpent)}</p>
        </div>
        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total de Leads</p>
          <p className="text-zinc-300 font-bold text-xl">{totalLeads}</p>
        </div>
        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Campanhas Ativas</p>
          <p className="text-zinc-300 font-bold text-xl">{activeCampaigns}</p>
        </div>
      </div>

      {/* Tabela ou mensagem de vazio */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 bg-zinc-800 border border-zinc-700">
          <p className="text-zinc-400">Nenhuma campanha encontrada nesse período.</p>
          <p className="text-zinc-500 text-sm">Tente selecionar um intervalo de datas diferente.</p>
        </div>
      ) : (
        <CampaignTable
          campaigns={campaigns}
        />
      )}

    </div>
  )
}