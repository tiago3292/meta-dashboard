// createContext cria o "canal" de comunicação global
// useState e useCallback são hooks do React (vamos explicar cada um abaixo)
import { createContext, useState, useCallback, useMemo } from "react"

// createContext cria o contexto em si — pense nele como uma "tomada"
// que outros componentes vão "ligar" para receber os dados
export const FilterContext = createContext()

// FilterProvider é o componente que vai ENVOLVER toda a aplicação
// Ele é o "gerador de energia" que alimenta todas as tomadas
export function FilterProvider({ children }) {

  // useState cria uma variável reativa: quando ela muda, o React re-renderiza
  // os componentes que dependem dela automaticamente
  // Aqui definimos as datas inicial e final do filtro
  const [startDate, setStartDate] = useState("2025-06-01")
  const [endDate,   setEndDate]   = useState("2025-06-07")

  // selectedCampaigns é um array com os IDs das campanhas selecionadas
  // O valor inicial é null, que vamos interpretar como "todas as campanhas"
  const [selectedCampaigns, setSelectedCampaigns] = useState(null)

  // useCallback memoriza a função para que ela não seja recriada
  // a cada re-renderização — é uma otimização de performance
  const updateDates = useCallback((start, end) => {
    setStartDate(start)
    setEndDate(end)
  }, []) // o array vazio significa: nunca recrie essa função

  const updateSelectedCampaigns = useCallback((ids) => {
    setSelectedCampaigns(ids)
  }, [])

  // useMemo memoriza o objeto de valor para evitar re-renderizações desnecessárias
  // Ele só recalcula quando startDate, endDate ou selectedCampaigns mudam
  const value = useMemo(() => ({
    startDate,            // data inicial do filtro
    endDate,              // data final do filtro
    selectedCampaigns,    // IDs das campanhas selecionadas (null = todas)
    updateDates,          // função para atualizar as datas
    updateSelectedCampaigns, // função para atualizar as campanhas selecionadas
  }), [startDate, endDate, selectedCampaigns, updateDates, updateSelectedCampaigns])

  // children representa tudo que estiver dentro de <FilterProvider>
  // Context.Provider é o componente que distribui o valor para toda a árvore abaixo
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}