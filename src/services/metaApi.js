// Leitura das variáveis de ambiente que configuramos no .env
const TOKEN = import.meta.env.VITE_META_TOKEN
const AD_ACCOUNT = import.meta.env.VITE_META_AD_ACCOUNT_ID


// Fixar a versão é uma boa prática. Evita que o código quebre
// por conta de atualização
const BASE_URL = `https://graph.facebook.com/v21.0`


// Função auxiliar que todos os outros métodos usarão
// Ela faz a chamada, verifica se deu erro, e retorna o JSON já parseado
async function metaFetch(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    // fetch é nativo do browser
    // await pausa a execução até a resposta chegar

    const data = await response.json()
    // .json() também é assíncrono: ele lê o corpo da resposta
    // e converte para objeto JS

    if (data.error) {
        // A API do Meta retorna erros dentro do JSON com a chave "error"
        // em vez de usar o status HTTP, é necessário checar manualmente
        throw new Error(data.error.message)
        // throw interrompe a execução e manda o erro para o .catch() de quem chamou
    }
    return data
}

// Busca todas as campanhas da conta de anúncios
// fields define os campos desejados
export async function fetchCampaigns() {
    const data = await metaFetch(
        `/act_${AD_ACCOUNT}/campaigns?fields=id,name,status&access_token=${TOKEN}`
    )
    // data.data é o array de campanhas. A API do Meta sempre envolve
    // os resultados em { data: [...] }
    return data.data
}

// Busca as métricas de uma campanha específica em um período de datas
// Insights são os dados de performance: gasto, alcance, leads, etc.
export async function fetchCampaignInsights(campaignId, startDate, endDate) {
  const data = await metaFetch(
    `/act_${AD_ACCOUNT}/insights?` +
    `fields=campaign_id,campaign_name,spend,reach,actions&` +

    // time_range filtra os dados pelo período selecionado no dashboard
    `time_range={"since":"${startDate}","until":"${endDate}"}&` +

    // level=campaign agrupa os dados por campanha
    // (não por conjunto de anúncios ou anúncio)
    `level=campaign&` +

    // filtering restringe os resultados à campanha específica
    `filtering=[{"field":"campaign.id","operator":"IN","value":["${campaignId}"]}]&` +

    // time_increment=1 retorna os dados dia a dia
    `time_increment=1&` +

    // limit=90 cobre períodos de até 3 meses com dados diários
    // 90 dias × n campanhas ainda cabe numa única resposta
    `limit=90&` +
    `access_token=${TOKEN}`
  )
  return data.data
}

// Busca os insights de TODAS as campanhas de uma vez para o Dashboard
export async function fetchAllInsights(startDate, endDate) {
  const data = await metaFetch(
    `/act_${AD_ACCOUNT}/insights?` +
    `fields=campaign_id,campaign_name,spend,reach,actions&` +
    `time_range={"since":"${startDate}","until":"${endDate}"}&` +
    `level=campaign&` +
    `time_increment=1&` +

    // Aumento do limite para garantir que todos os registros
    // venham numa única chamada
    `limit=500&` +
    `access_token=${TOKEN}`
  )
  return data.data
}

// A API do Meta retorna as ações (conversões) em um array dentro de cada insight
// Precisamos de uma função auxiliar para extrair a quantidade de leads desse array
// porque leads podem estar registrados como "lead" ou
// "onsite_conversion.messaging_conversation_started_7d"
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

// Transforma o formato bruto da API do Meta no formato que os componentes esperam.
// Os componentes não precisam saber nada sobre a API do Meta.
// Eles só conhecem o formato definido aqui
export function normalizeInsights(rawInsights) {
  
  // Agrupando os dados diários por campanha
  const campaignMap = {}

  rawInsights.forEach((insight) => {
    const id = insight.campaign_id

    if (!campaignMap[id]) {
      // Primeira vez vendo essa campanha > cria a entrada
      campaignMap[id] = {
        id,
        name: insight.campaign_name,
        status: "ACTIVE", // a API de insights não retorna status, buscamos em fetchCampaigns
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

    // Acumula os totais
    campaignMap[id].spent += spent
    campaignMap[id].leads += leads
    campaignMap[id].reach += reach

    // Adiciona o dia ao array dailyData
    campaignMap[id].dailyData.push({
      date: insight.date_start,
      spent,
      leads,
      reach,
    })
  })

  // Calcula o CPL de cada campanha após somar todos os dias
  Object.values(campaignMap).forEach((campaign) => {
    campaign.cpl = campaign.leads > 0
      ? campaign.spent / campaign.leads
      : 0
  })
  // Retorna um array ordenado por valor gasto (maior primeiro)
  return Object.values(campaignMap).sort((a, b) => b.spent - a.spent)
}