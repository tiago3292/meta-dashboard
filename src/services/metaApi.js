const TOKEN = import.meta.env.VITE_META_TOKEN
const AD_ACCOUNT = import.meta.env.VITE_META_AD_ACCOUNT_ID

const BASE_URL = `https://graph.facebook.com/v21.0`

async function metaFetch(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`)

    const data = await response.json()

    if (data.error) {
        throw new Error(data.error.message)
    }
    return data
}

export async function fetchCampaigns() {
    const data = await metaFetch(
        `/act_${AD_ACCOUNT}/campaigns?fields=id,name,status&access_token=${TOKEN}`
    )
    return data.data
}

export async function fetchCampaignInsights(campaignId, startDate, endDate) {
  const data = await metaFetch(
    `/act_${AD_ACCOUNT}/insights?` +
    `fields=campaign_id,campaign_name,spend,reach,actions&` +
    `time_range={"since":"${startDate}","until":"${endDate}"}&` +
    `level=campaign&` +
    `filtering=[{"field":"campaign.id","operator":"IN","value":["${campaignId}"]}]&` +
    `time_increment=1&` +
    // limit=90 cobre períodos de até 3 meses com dados diários
    // 90 dias × n campanhas ainda cabe numa única resposta
    `limit=90&` +
    `access_token=${TOKEN}`
  )
  return data.data
}

export async function fetchAllInsights(startDate, endDate) {
  const data = await metaFetch(
    `/act_${AD_ACCOUNT}/insights?` +
    `fields=campaign_id,campaign_name,spend,reach,actions&` +
    `time_range={"since":"${startDate}","until":"${endDate}"}&` +
    `level=campaign&` +
    `time_increment=1&` +
    // Com múltiplas campanhas e muitos dias, aumentamos o limite
    // para garantir que todos os registros venham numa única chamada
    `limit=500&` +
    `access_token=${TOKEN}`
  )
  return data.data
}

export function extractLeads(actions) {
  if (!actions) return 0

  // Procuramos primeiro pelo tipo mais específico de cada canal
  // A ordem importa: paramos no primeiro que encontrar para evitar dupla contagem

  // Leads por formulário
  const formLead = actions.find((a) => a.action_type === "lead")
  if (formLead) return parseFloat(formLead.value)

  // Leads por WhatsApp
  const waLead = actions.find(
    (a) => a.action_type === "onsite_conversion.messaging_conversation_started_7d"
  )
  if (waLead) return parseFloat(waLead.value)

  // Se não encontrou nenhum tipo conhecido, retorna zero
  return 0
}

export function normalizeInsights(rawInsights) {
  const campaignMap = {}

  rawInsights.forEach((insight) => {
    const id = insight.campaign_id

    if (!campaignMap[id]) {
      campaignMap[id] = {
        id,
        name: insight.campaign_name,
        status: "ACTIVE",
        spent: 0,
        leads: 0,
        reach: 0,
        cpl: 0,
        dailyData: [],
      }
    }

    const leads = extractLeads(insight.actions)
    const spent = parseFloat(insight.spend) || 0
    const reach = parseInt(insight.reach)   || 0

    campaignMap[id].spent += spent
    campaignMap[id].leads += leads
    campaignMap[id].reach += reach

    campaignMap[id].dailyData.push({
      date: insight.date_start,
      spent,
      leads,
      reach,
    })
  })

  Object.values(campaignMap).forEach((campaign) => {
    campaign.cpl = campaign.leads > 0
      ? campaign.spent / campaign.leads
      : 0
  })

  return Object.values(campaignMap).sort((a, b) => b.spent - a.spent)
}