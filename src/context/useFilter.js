// useContext é o hook que "liga na tomada" e acessa
// o valor do contextoimport { useContext } from "react"
import { useContext } from "react"
import { FilterContext } from "./FilterContext"

// Hook personalizado que transforma useContext(FilterContext) 
// em useFilter()
export function useFilter() {
    return useContext(FilterContext)
}