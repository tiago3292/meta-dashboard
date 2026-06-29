import { useState, useEffect, useMemo } from "react"

import {
  LineChart, // o container do gráfico de linha
  Line, // cada linha do gráfico
  XAxis, // eixo horizontal (datas)
  YAxis, // eixo vertical (valores)
  CartesianGrid, // as linhas de grade ao fundo
  Tooltip, // o balão que aparece ao passar o mouse
  Legend, // a legenda das linhas
  ResponsiveContainer, // faz o gráfico ocupar 100% da largura disponível
} from "recharts"

import { useFilter } from "../context/useFilter"
import { fetchAllInsights, normalizeInsights } from "../services/metaApi" 
import StatCard from "../components/ui/StatCard"

export default function Dashboard() {
  const { startDate, endDate } = useFilter()

  // Guarda os dados normalizados vindos da API
  const [campaigns, setCampaigns] = useState([])

  // Controla quando mostrar o indicador de carregamento
  const [loading, setLoading] = useState(true)

  // Guarda a mensagem de erro caso a chamada falhe
  const [error, setError] = useState(null)

  // Roda toda vez que startDate ou endDate mudam
  useEffect(() => {

    // A função de busca é definida dentro do useEffect
    // porque funções async não podem ser passadas diretamente para o useEffect
    async function loadData() {
      // Sempre que uma nova busca é iniciada:
      setLoading(true) // ativa o indicador de carregamento
      setError(null) // limpa qualquer erro anterior

      try {
        // Busca dados brutos da API do Meta
        const rawInsights = await fetchAllInsights(startDate, endDate)

        // Transforma para o formato que os componentes entendem
        const normalized = normalizeInsights(rawInsights)

        setCampaigns(normalized)
      } catch (err) {
        // Se qualquer coisa der errado, guardamos a mensagem de erro
        // para exibir na tela
        setError(err.message)
      } finally {
        // finally roda SEMPRE, independente de sucesso ou erro
        // Garante que o loading seja desativado em qualquer cenário
        setLoading(false)
      }
    }

    loadData()
  }, [startDate, endDate]) //garante que a busca roda novamente
  //sempre que o período selecionado mudar


  // Essa função recebe um array de campanhas e retorna um único objeto
  // com os totais somados — vai alimentar os cards de resumo do Dashboard
  const summary = useMemo(() => {
    return campaigns.reduce(
      // acc é o "acumulador". Começa zerado e vai somando a cada campanha
      (acc, c) => ({
        spent: acc.spent + c.spent, // soma o valor gasto
        leads: acc.leads + c.leads, // soma os leads
        reach: acc.reach + c.reach, // soma o alcance
      }),

      // Valor inicial do acumulador
      {spent: 0, leads: 0, reach: 0}
    )
  }, [campaigns])

  // Essa função agrupa o desempenho diário de todas as campanhas em uma única linha do tempo
  // O resultado vai alimentar o gráfico de linha do Dashboard
  const chartData = useMemo(() => {

    // Objeto vazio que vai acumular os dados por data
    // { "2025-06-01": { date, spent, leads, reach }, ... }
    const merged = {}

    campaigns.forEach((campaign) => {
      campaign.dailyData.forEach((day) => {
        if (!merged[day.date]) {
          // Se essa data ainda não existe no objeto, cria ela do zero
          merged[day.date] = { date: day.date, spent: 0, leads: 0, reach: 0 }
        }
        // Soma os valores dessa campanha nos totais daquele dia
        merged[day.date].spent += day.spent
        merged[day.date].leads += day.leads
        merged[day.date].reach += day.reach
      })
    })

    // Object.values transforma o objeto em array, e sort ordena por data crescente
    return Object.values(merged).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [campaigns])

  const avgCpl = summary.leads > 0
    ? (summary.spent / summary.leads).toFixed(2)
    : 0

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatNumber = (value) =>
    new Intl.NumberFormat("pt-BR").format(value)

  // Estado de carregamento
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-zinc-600 border-t-blue-500
        rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Buscando dados do Meta Ads...</p>
      </div>
    )
  }

  // Estado de erro
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

  // Estado sem dados
  // Quando a API responde mas não há campanhas no período selecionado
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col item-center justify-center h-64 gap-3">
        <p className="text-zinc-400">Nenhuma campanha encontrada nesse período.</p>
        <p className="text-zinc-500 text-sm">Tente selecionar um intervalo de datas diferente.</p>
      </div>
    )
  }

  // Estado normal: dados carregados com sucesso
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
                backgroundColor: "#212124",
                border: "1px solid #333338",
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