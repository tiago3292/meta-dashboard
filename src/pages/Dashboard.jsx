import { useMemo } from "react"
// Importamos os componentes de gráfico que vamos usar do Recharts
import {
  LineChart,   // o container do gráfico de linha
  Line,        // cada linha do gráfico
  XAxis,       // eixo horizontal (datas)
  YAxis,       // eixo vertical (valores)
  CartesianGrid, // as linhas de grade ao fundo
  Tooltip,     // o balão que aparece ao passar o mouse
  Legend,      // a legenda das linhas
  ResponsiveContainer, // faz o gráfico ocupar 100% da largura disponível
} from "recharts"

import { useFilter } from "../context/useFilter"
import { campaigns, getSummary, getMergedDailyData } from "../data/mockData"
import StatCard from "../components/ui/StatCard"

export default function Dashboard() {
  const { startDate, endDate } = useFilter()

  // useMemo recalcula esse valor só quando startDate ou endDate mudam
  // Filtramos as campanhas cujo dailyData tem ao menos um dia no período selecionado
  const filteredCampaigns = useMemo(() => {
    return campaigns.map((campaign) => {
      // Para cada campanha, filtramos apenas os dias dentro do período
      const filteredDays = campaign.dailyData.filter(
        (day) => day.date >= startDate && day.date <= endDate
        // Comparação de strings funciona aqui porque o formato é "YYYY-MM-DD"
        // que é naturalmente ordenável como texto
      )
      // Retornamos a campanha com apenas os dias filtrados
      return { ...campaign, dailyData: filteredDays }
      // O operador spread "..." copia todas as propriedades do objeto original
      // e depois sobrescrevemos só o dailyData com os dias filtrados
    }).filter((campaign) => campaign.dailyData.length > 0)
    // Removemos campanhas que ficaram sem nenhum dia no período
  }, [startDate, endDate])

  // getSummary soma os dados de todas as campanhas filtradas
  const summary = useMemo(() => getSummary(filteredCampaigns), [filteredCampaigns])

  // getMergedDailyData junta os dados diários de todas as campanhas em uma linha do tempo
  const chartData = useMemo(() => getMergedDailyData(filteredCampaigns), [filteredCampaigns])

  // Calculamos o CPL médio do período: total gasto / total de leads
  // O operador || 0 evita divisão por zero caso não haja leads
  const avgCpl = summary.leads > 0
    ? (summary.spent / summary.leads).toFixed(2)
    : 0

  // Formata número como moeda brasileira: 1200.5 → "R$ 1.200,50"
  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  // Formata número grande com separador de milhar: 45000 → "45.000"
  const formatNumber = (value) =>
    new Intl.NumberFormat("pt-BR").format(value)

  return (
    // gap-6 = espaçamento de 24px entre os elementos filhos
    <div className="flex flex-col gap-6">

      {/* ── Cards de resumo ── */}
      {/* grid com 4 colunas em telas médias ou maiores, 2 em telas pequenas */}
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

      {/* ── Gráfico de desempenho ── */}
      <div className="bg-zinc-800 p-5 border border-zinc-700">

        <h2 className="text-white font-semibold mb-4">
          Desempenho no Período
        </h2>

        {/* ResponsiveContainer precisa de uma altura fixa definida */}
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>

            {/* Grade de fundo: stroke define a cor das linhas */}
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

            {/* Eixo X mostra as datas */}
            {/* dataKey diz qual campo do objeto usar como rótulo */}
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              // tickFormatter formata o valor antes de exibir
              // Pegamos só o dia da data: "2025-06-01" → "01"
              tickFormatter={(val) => val.slice(8)}
            />

            {/* Eixo Y da esquerda: mostra os leads */}
            <YAxis
              yAxisId="left"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            {/* Eixo Y da direita: mostra o valor gasto */}
            {/* orientation="right" posiciona no lado direito do gráfico */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              // tickFormatter formata os valores do eixo como "R$ 100"
              tickFormatter={(val) => `R$${val}`}
            />

            {/* Tooltip: o balão que aparece ao passar o mouse */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b", // fundo escuro
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#e2e8f0" }}
              // Formata o valor exibido no tooltip dependendo do nome da linha
              formatter={(value, name) => {
                if (name === "Gasto") return [formatBRL(value), name]
                return [formatNumber(value), name]
              }}
            />

            <Legend
              wrapperStyle={{ color: "#94a3b8", fontSize: 13 }}
            />

            {/* Linha de Leads: usa o eixo Y da esquerda */}
            <Line
              yAxisId="left"
              type="monotone"   // curva suave entre os pontos
              dataKey="leads"
              name="Leads"
              stroke="#3b82f6"  // azul
              strokeWidth={2}
              dot={false}       // esconde os pontos individuais
            />

            {/* Linha de Gasto: usa o eixo Y da direita */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="spent"
              name="Gasto"
              stroke="#10b981"  // verde
              strokeWidth={2}
              dot={false}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}