// Cada objeto dentro desse array representa uma campanha do Meta Ads
// Esses dados simulam exatamente o formato que a API real do Meta retornaria
export const campaigns = [
  {
    id: "1",                        // identificador único da campanha
    name: "Campanha Verão 2025",    // nome da campanha
    status: "ACTIVE",               // status: ACTIVE (ativa) ou PAUSED (pausada)
    spent: 1200.50,                 // valor gasto em reais
    leads: 98,                      // quantidade de leads gerados
    reach: 45000,                   // quantidade de pessoas que viram o anúncio
    cpl: 12.25,                     // custo por lead (spent / leads)
    // dailyData é um array com o desempenho dia a dia dessa campanha
    // Isso vai alimentar o gráfico de linha no Dashboard
    dailyData: [
      { date: "2025-06-01", spent: 40.00, leads: 3, reach: 1500 },
      { date: "2025-06-02", spent: 45.00, leads: 4, reach: 1700 },
      { date: "2025-06-03", spent: 38.00, leads: 3, reach: 1400 },
      { date: "2025-06-04", spent: 52.00, leads: 5, reach: 1900 },
      { date: "2025-06-05", spent: 41.00, leads: 3, reach: 1550 },
      { date: "2025-06-06", spent: 60.00, leads: 6, reach: 2100 },
      { date: "2025-06-07", spent: 55.00, leads: 5, reach: 2000 },
    ],
  },
  {
    id: "2",
    name: "Promoção Black Friday",
    status: "PAUSED",
    spent: 3400.00,
    leads: 210,
    reach: 120000,
    cpl: 16.19,
    dailyData: [
      { date: "2025-06-01", spent: 480.00, leads: 30, reach: 17000 },
      { date: "2025-06-02", spent: 510.00, leads: 32, reach: 18000 },
      { date: "2025-06-03", spent: 490.00, leads: 29, reach: 17200 },
      { date: "2025-06-04", spent: 520.00, leads: 33, reach: 18500 },
      { date: "2025-06-05", spent: 470.00, leads: 28, reach: 16800 },
      { date: "2025-06-06", spent: 460.00, leads: 29, reach: 16500 },
      { date: "2025-06-07", spent: 470.00, leads: 29, reach: 17000 },
    ],
  },
  {
    id: "3",
    name: "Lançamento Produto X",
    status: "ACTIVE",
    spent: 870.00,
    leads: 54,
    reach: 32000,
    cpl: 16.11,
    dailyData: [
      { date: "2025-06-01", spent: 120.00, leads: 7, reach: 4500 },
      { date: "2025-06-02", spent: 130.00, leads: 8, reach: 4700 },
      { date: "2025-06-03", spent: 115.00, leads: 7, reach: 4300 },
      { date: "2025-06-04", spent: 140.00, leads: 9, reach: 4900 },
      { date: "2025-06-05", spent: 125.00, leads: 8, reach: 4600 },
      { date: "2025-06-06", spent: 120.00, leads: 8, reach: 4500 },
      { date: "2025-06-07", spent: 120.00, leads: 7, reach: 4500 },
    ],
  },
  {
    id: "4",
    name: "Remarketing Maio",
    status: "ACTIVE",
    spent: 530.75,
    leads: 41,
    reach: 18500,
    cpl: 12.94,
    dailyData: [
      { date: "2025-06-01", spent: 75.00, leads: 6, reach: 2600 },
      { date: "2025-06-02", spent: 80.00, leads: 6, reach: 2700 },
      { date: "2025-06-03", spent: 70.00, leads: 5, reach: 2500 },
      { date: "2025-06-04", spent: 85.00, leads: 7, reach: 2800 },
      { date: "2025-06-05", spent: 75.00, leads: 6, reach: 2600 },
      { date: "2025-06-06", spent: 73.00, leads: 5, reach: 2600 },
      { date: "2025-06-07", spent: 72.75, leads: 6, reach: 2700 },
    ],
  },
]

// Essa função recebe um array de campanhas e retorna um único objeto
// com os totais somados — vai alimentar os cards de resumo do Dashboard
export function getSummary(campaignList) {
  return campaignList.reduce(
    (acc, campaign) => {
      // acc é o "acumulador": começa zerado e vai somando a cada campanha
      acc.spent  += campaign.spent   // soma o valor gasto
      acc.leads  += campaign.leads   // soma os leads
      acc.reach  += campaign.reach   // soma o alcance
      return acc
    },
    // Esse é o valor inicial do acumulador: todos os campos começam em zero
    { spent: 0, leads: 0, reach: 0 }
  )
}

// Essa função agrupa o desempenho diário de todas as campanhas em uma única linha do tempo
// O resultado vai alimentar o gráfico de linha do Dashboard
export function getMergedDailyData(campaignList) {
  // Criamos um objeto vazio que vai acumular os dados por data
  // Exemplo do resultado esperado: { "2025-06-01": { date, spent, leads, reach }, ... }
  const merged = {}

  campaignList.forEach((campaign) => {
    campaign.dailyData.forEach((day) => {
      if (!merged[day.date]) {
        // Se essa data ainda não existe no objeto, criamos ela do zero
        merged[day.date] = { date: day.date, spent: 0, leads: 0, reach: 0 }
      }
      // Somamos os valores dessa campanha nos totais daquele dia
      merged[day.date].spent  += day.spent
      merged[day.date].leads  += day.leads
      merged[day.date].reach  += day.reach
    })
  })

  // Object.values transforma o objeto em array, e sort ordena por data crescente
  return Object.values(merged).sort((a, b) => new Date(a.date) - new Date(b.date))
}