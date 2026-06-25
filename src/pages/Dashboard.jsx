import { useState, useEffect, useMemo } from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { useFilter } from "../context/useFilter"
import { fetchAllInsights, normalizeInsights } from "../services/metaApi" 
import StatCard from "../components/ui/StatCard"

export default function Dashboard() {
  const { startDate, endDate } = useFilter()

  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const rawInsights = await fetchAllInsights(startDate, endDate)

        const normalized = normalizeInsights(rawInsights)

        setCampaigns(normalized)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [startDate, endDate])

  const summary = useMemo(() => {
    return campaigns.reduce(
      (acc, c) => ({
        spent: acc.spent + c.spent,
        leads: acc.leads + c.leads,
        reach: acc.reach + c.reach,
      }),
      {spent: 0, leads: 0, reach: 0}
    )
  }, [campaigns])

  const chartData = useMemo(() => {
    const merged = {}
    campaigns.forEach((campaign) => {
      campaign.dailyData.forEach((day) => {
        if (!merged[day.date]) {
          merged[day.date] = { date: day.date, spent: 0, leads: 0, reach: 0 }
        }
        merged[day.date].spent += day.spent
        merged[day.date].leads += day.leads
        merged[day.date].reach += day.reach
      })
    })
    return Object.values(merged).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [campaigns])

  const avgCpl = summary.leads > 0
    ? (summary.spent / summary.leads).toFixed(2)
    : 0

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatNumber = (value) =>
    new Intl.NumberFormat("pt-BR").format(value)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-zinc-600 border-t-blue-500
        rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Buscando dados do Meta Ads...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400 font-medium">Erro ao buscar dados</p>
        <p className="text-zinc-400 text-sm text-center max-w-md">{error}</p>
        <p className="text-zinc-500 text-xs">
          Verifique se o token no .env ainda é válido e tente novamente.
        </p>
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col item-center justify-center h-64 gap-3">
        <p className="text-zinc-400">Nenhuma campanha encontrada nesse período.</p>
        <p className="text-zinc-500 text-sm">Tente selecionar um intervalo de datas diferente.</p>
      </div>
    )
  }

  return (

    <div className="flex flex-col gap-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Gasto"
          value={formatBRL(summary.spent)}
          icon="💰"
        />
        <StatCard
          title="Leads"
          value={formatNumber(summary.leads)}
          icon="🎯"
        />
        <StatCard
          title="Alcance"
          value={formatNumber(summary.reach)}
          icon="📣"
        />
        <StatCard
          title="CPL Médio"
          value={formatBRL(avgCpl)}
          icon="📊"
        />
      </div>

      <div className="bg-zinc-800 p-5 border border-zinc-700">

        <h2 className="text-zinc-300 font-semibold mb-4">
          Desempenho do Período
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(val) => val.slice(8)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(val) => `R$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#e2e8f0" }}

              formatter={(value, name) => {
                if (name === "Gasto") return [formatBRL(value, name)]
                return [formatNumber(value), name]
              }}
            />
            <Legend
              wrapperStyle={{ color: "#94a3b8", fontSize: 13 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="spent"
              name="Gasto"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}