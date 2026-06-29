// createContext cria o "canal" de comunicação global
import { createContext, useState, useCallback, useMemo } from "react"

// "Tomada" que outros componentes usarão para receber dados
export const FilterContext = createContext()

// Componente que envolverá toda a aplicação.
// "Gerador de energia" que alimenta todas as tomadas
export function FilterProvider({ children }) {

    // useState cria uma variável que armazena dados
    // e uma função que é usada para alterar esses dados
    // valor dentro do "()" é o valor inicial padrão (opcional)
    // Aqui definimos as datas inicial e final do filtro
    const [startDate, setStartDate] = useState("2026-01-01")
    const [endDate, setEndDate] = useState("2026-02-01")

    // selectedCampaigns é um array com os IDs das campanhas selecionadas
    // O valor inicial é null, que significará "todas as campanhas"
    const [selectedCampaigns, setSelectedCampaigns] = useState(null)

    // Otimizador de performance: useCallback memoriza a função
    // para que ela não seja recriada a cada re-renderização.
    const updateDates = useCallback((start, end) => {
        setStartDate(start)
        setEndDate(end)
    }, []) // Array vazia = "nunca recrie essa função"

    const updateSelectedCampaigns = useCallback((ids) => {
        setSelectedCampaigns(ids)
    }, [])

    // useMemo memoriza o objeto de valor para evitar re-renderizações desnecessárias
    // Ele só recalcula quando startDate, endDate ou selectedCampaigns mudam
    const value = useMemo(() => ({
        startDate,
        endDate,
        selectedCampaigns,
        updateDates,
        updateSelectedCampaigns,
    }), [startDate, endDate, selectedCampaigns, updateDates, updateSelectedCampaigns])

    // children representa tudo que estiver dentro de <FilterProvider>
    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}