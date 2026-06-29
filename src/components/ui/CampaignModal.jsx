import { useState, useEffect } from "react"

// Esse componente recebe:
// - campaign: a campanha sendo editada (ou null se for uma nova campanha)
// - onSave: função chamada quando o usuário confirma o formulário
// - onClose: função chamada para fechar o modal sem salvar
export default function CampaignModal({ campaign, onSave, onClose }) {

  // formData guarda os valores dos campos do formulário
  // Começamos com valores vazios/padrão
  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE",
    spent: "",
    leads: "",
    reach: "",
  })

  // useEffect roda sempre que a prop "campaign" mudar
  // Isso preenche o formulário automaticamente quando abrimos o modal para EDITAR
  useEffect(() => {
    if (campaign) {
      // Se existe uma campanha (modo edição), preenchemos o formData com os dados dela
      setFormData({
        name: campaign.name,
        status: campaign.status,
        spent: campaign.spent,
        leads: campaign.leads,
        reach: campaign.reach,
      })
    }
    // Se campaign for null (modo criação), o formData continua com os valores vazios iniciais
  }, [campaign])

  // handleChange atualiza um campo específico do formData
  // Usamos uma função genérica para não repetir código para cada input
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,           // mantém todos os outros campos como estão
      [field]: e.target.value, // sobrescreve só o campo que mudou
      // [field] com colchetes permite usar uma variável como nome de propriedade
    }))
  }

  // handleSubmit é chamado quando o usuário clica em "Salvar"
  const handleSubmit = () => {
    // Convertemos os campos numéricos de string (vindos do input) para number
    const spent = parseFloat(formData.spent) || 0
    const leads = parseInt(formData.leads) || 0
    const reach = parseInt(formData.reach) || 0

    // Calculamos o CPL automaticamente: gasto / leads (evitando divisão por zero)
    const cpl = leads > 0 ? spent / leads : 0

    onSave({
      // Se estiver editando, mantém o id e o dailyData originais
      // Se for criação, usa Date.now() como id único temporário e um array vazio de dailyData
      id: campaign?.id ?? String(Date.now()),
      dailyData: campaign?.dailyData ?? [],
      name: formData.name,
      status: formData.status,
      spent,
      leads,
      reach,
      cpl,
    })
  }

  return (
    // Fundo escurecido (overlay) que cobre a tela toda
    // fixed inset-0 = ocupa a tela inteira, independente do scroll
    // bg-black/60 = preto com 60% de opacidade
    // flex items-center justify-center = centraliza o modal na tela
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      {/* Caixa do modal em si */}
      <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-md border border-zinc-700">

        <h2 className="text-white font-semibold text-lg mb-4">
          {/* Título muda dependendo se é edição ou criação */}
          {campaign ? "Editar Campanha" : "Nova Campanha"}
        </h2>

        {/* flex-col gap-4 = empilha os campos verticalmente com espaçamento */}
        <div className="flex flex-col gap-4">

          {/* Campo: Nome */}
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Campo: Status */}
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Status</label>
            <select
              value={formData.status}
              onChange={handleChange("status")}
              className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:outline-none focus:border-orange-500"
            >
              <option value="ACTIVE">Ativa</option>
              <option value="PAUSED">Pausada</option>
            </select>
          </div>

          {/* Campo: Valor Gasto */}
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Valor Gasto (R$)</label>
            <input
              type="number"
              step="0.01" // permite centavos
              value={formData.spent}
              onChange={handleChange("spent")}
              className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Campo: Leads */}
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Leads</label>
            <input
              type="number"
              value={formData.leads}
              onChange={handleChange("leads")}
              className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Campo: Alcance */}
          <div>
            <label className="text-zinc-400 text-sm block mb-1">Alcance</label>
            <input
              type="number"
              value={formData.reach}
              onChange={handleChange("reach")}
              className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 border border-zinc-600 focus:outline-none focus:border-orange-500"
            />
          </div>

        </div>

        {/* Botões de ação */}
        {/* justify-end = alinha os botões à direita, mt-6 = espaço acima */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-700 text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium"
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  )
}