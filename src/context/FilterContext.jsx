import { createContext, useState, useCallback, useMemo } from "react"

export const FilterContext = createContext()

export function FilterProvider({ children }) {
    const [startDate, setStartDate] = useState("2025-06-01")
    const [endDate, setEndDate] = useState("2025-06-07")
    const [selectedCampaigns, setSelectedCampaigns] = useState(null)

    const updateDates = useCallback((start, end) => {
        setStartDate(start)
        setEndDate(end)
    }, [])

    const updateSelectedCampaigns = useCallback((ids) => {
        setSelectedCampaigns(ids)
    }, [])

    const value = useMemo(() => ({
        startDate,
        endDate,
        selectedCampaigns,
        updateDates,
        updateSelectedCampaigns,
    }), [startDate, endDate, selectedCampaigns, updateDates, updateSelectedCampaigns])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}