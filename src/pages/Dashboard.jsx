import { useMemo } from "react"

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
import { campaigns, getSummary, getMergedDailyData } from "../data/mockData"
import StatCard from "../components/ui/StatCard"

export default function Dashboard() {

  const { startDate, endDate } = useFilter()

  const filteredCampaigns = useMemo(() => {
    return campaigns.map((campaign) => {
      const filteredDays = campaign.dailyData.filter(
        (day) => day.date >= startDate && day.date <= endDate
      )
      return { ...campaign, dailyData: filteredDays }
    }).filter((campaign) => campaign.dailyData.length > 0)
  }, [startDate, endDate])

  const summary = useMemo(() => getSummary(filteredCampaigns), [filteredCampaigns])

  const chartData = useMemo(() => getMergedDailyData(filteredCampaigns), [filteredCampaigns])

  const avgCpl = summary.leads > 0
  ? (summary.spent / summary.leads).toFixed(2)
  : 0

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatNumber = (value) =>
    new Intl.NumberFormat("pt-BR").format(value)

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

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">

        <h2 className="text-white font-semibold mb-4">
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