import { useState } from "react"
import { campaigns as initialCampaigns } from "../data/mockData"
import CampaignTable from "../components/ui/CampaignTable"
import CampaignModal from "../components/ui/CampaignModal"

export default function Campaigns() {

  // O estado começa com os dados do mockData, mas vive na memória do React
  // Qualquer alteração (criar, editar, excluir) atualiza esse estado
  // e o React re-renderiza a tabela automaticamente
  const [campaigns, setCampaigns] = useState(initialCampaigns)

  // modalState controla o que o modal está fazendo agora
  // - { open: false } → modal fechado
  // - { open: true, campaign: null } → modal aberto para CRIAR
  // - { open: true, campaign: {...} } → modal aberto para EDITAR
  const [modalState, setModalState] = useState({ open: false, campaign: null })

  // Abre o modal para criar uma nova campanha
  const handleNew = () => {
    setModalState({ open: true, campaign: null })
  }

  // Abre o modal para editar uma campanha existente
  // Recebe a campanha inteira como argumento (vinda do botão "Editar" da tabela)
  const handleEdit = (campaign) => {
    setModalState({ open: true, campaign })
    // { open: true, campaign } é a mesma coisa que { open: true, campaign: campaign }
    // Quando a chave e a variável têm o mesmo nome, podemos omitir a repetição
  }

  // Fecha o modal sem salvar nada
  const handleClose = () => {
    setModalState({ open: false, campaign: null })
  }

  // Salva uma campanha: funciona tanto para criar quanto para editar
  const handleSave = (updatedCampaign) => {
    setCampaigns((prev) => {
      // Verificamos se já existe uma campanha com esse id no array
      const exists = prev.some((c) => c.id === updatedCampaign.id)
      // .some() percorre o array e retorna true se ALGUM elemento satisfizer a condição

      if (exists) {
        // EDIÇÃO: substituímos a campanha antiga pela atualizada
        // .map() percorre o array e retorna um novo array
        // Para a campanha com o mesmo id, retornamos a versão atualizada
        // Para todas as outras, retornamos elas sem modificação
        return prev.map((c) => c.id === updatedCampaign.id ? updatedCampaign : c)
      } else {
        // CRIAÇÃO: adicionamos a nova campanha ao final do array
        // O spread ...prev copia todas as campanhas existentes
        return [...prev, updatedCampaign]
      }
    })

    // Fecha o modal após salvar
    handleClose()
  }

  // Exclui uma campanha pelo id
  const handleDelete = (id) => {
    // Pedimos confirmação antes de excluir — boa prática de UX
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return

    setCampaigns((prev) =>
      // .filter() retorna um novo array apenas com os elementos que passam na condição
      // Mantemos todas as campanhas EXCETO a que tem o id igual ao que queremos excluir
      prev.filter((c) => c.id !== id)
    )
  }

  // Calculamos os totais para os cards de resumo no topo da página
  const totalSpent  = campaigns.reduce((acc, c) => acc + c.spent, 0)
  const totalLeads  = campaigns.reduce((acc, c) => acc + c.leads, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length
  // .length retorna a quantidade de elementos no array

  const formatBRL = (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Cabeçalho da página ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">Campanhas</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {/* Exibe quantas campanhas estão sendo mostradas */}
            {campaigns.length} campanha{campaigns.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
        >
          {/* O símbolo + é adicionado via texto mesmo */}
          <span className="text-lg leading-none">+</span>
          Nova Campanha
        </button>
      </div>

      {/* ── Cards de resumo rápido ── */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Gasto</p>
          <p className="text-white font-bold text-xl">{formatBRL(totalSpent)}</p>
        </div>

        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total de Leads</p>
          <p className="text-white font-bold text-xl">{totalLeads}</p>
        </div>

        <div className="bg-zinc-800 p-4 border border-zinc-700">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Campanhas Ativas</p>
          <p className="text-white font-bold text-xl">{activeCampaigns}</p>
        </div>

      </div>

      {/* ── Tabela de campanhas ── */}
      <CampaignTable
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Modal: só renderiza quando está aberto ── */}
      {/* O && faz o React renderizar o modal APENAS quando modalState.open for true */}
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