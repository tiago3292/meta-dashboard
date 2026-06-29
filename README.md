# Meta Ads Dashboard

Dashboard para acompanhamento de campanhas do Meta Ads (Facebook/Instagram) em tempo real. Desenvolvido como projeto do **Month 6 Challenge** de um desafio de desenvolvimento de 12 meses, com foco em conceitos avançados de React.

![Dashboard Preview](https://via.placeholder.com/900x500/1e293b/3b82f6?text=Meta+Ads+Dashboard)

---

## Funcionalidades

- **Filtro de período** — selecione o intervalo de datas diretamente no cabeçalho e todos os dados atualizam automaticamente
- **Cards de resumo** — total gasto, leads gerados, alcance e CPL médio do período
- **Gráfico de desempenho** — linha dupla com leads (eixo esquerdo) e valor gasto (eixo direito) ao longo do tempo
- **Tabela de campanhas** — todas as campanhas da conta com status, métricas e ações
- **Suporte a múltiplos tipos de conversão** — leads por formulário e conversas iniciadas pelo WhatsApp

---

## Tecnologias utilizadas

- [React](https://react.dev/) — biblioteca de interface
- [Vite](https://vitejs.dev/) — bundler e servidor de desenvolvimento
- [React Router](https://reactrouter.com/) — navegação entre páginas
- [Context API](https://react.dev/reference/react/createContext) — estado global do filtro de datas
- [TailwindCSS](https://tailwindcss.com/) — estilização
- [Recharts](https://recharts.org/) — gráficos
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis/) — dados reais de campanhas

---

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx       # Navegação lateral
│   │   └── Header.jsx        # Cabeçalho com filtro de datas
│   └── ui/
│       ├── StatCard.jsx      # Card de métrica
│       ├── CampaignTable.jsx # Tabela de campanhas
│       └── CampaignModal.jsx # Modal de criação/edição
├── context/
│   ├── FilterContext.jsx     # Provider do filtro global
│   └── useFilter.js          # Hook de acesso ao contexto
├── pages/
│   ├── Dashboard.jsx         # Página principal com cards e gráfico
│   └── Campaigns.jsx         # Página de campanhas com CRUD
└── services/
    └── metaApi.js            # Integração com a Meta Marketing API
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Uma conta no [Meta for Developers](https://developers.facebook.com/) com o produto **Marketing API** configurado
- Acesso de administrador a uma conta de anúncios no Meta Business

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/meta-dashboard.git
cd meta-dashboard

# Instale as dependências
npm install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto:

```
VITE_META_TOKEN=seu_token_de_acesso_aqui
VITE_META_AD_ACCOUNT_ID=seu_ad_account_id_aqui
```

**Como obter o token:**
1. Acesse [developers.facebook.com](https://developers.facebook.com) e abra o seu app
2. Vá em **Marketing API → Ferramentas**
3. Selecione as permissões `ads_read`, `ads_management` e `leads_retrieval`
4. Clique em **Gerar token** e copie o valor gerado

**Como obter o ID da conta de anúncios:**
1. Acesse [business.facebook.com](https://business.facebook.com)
2. Vá em **Contas de anúncios** e selecione a conta desejada
3. O ID aparece no formato `act_XXXXXXXXXX` — use apenas os números

> ⚠️ O token gerado pelas Ferramentas do Meta expira em aproximadamente 1 hora. Para uso contínuo, converta-o para um token de longa duração (60 dias) via API.

### Executar

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Conceitos aplicados

Este projeto foi desenvolvido como exercício prático dos seguintes conceitos:

- **React Router** — navegação entre Dashboard e Campanhas
- **Context API** — compartilhamento do filtro de datas entre componentes sem prop drilling
- **Custom hooks** — `useFilter()` como abstração do contexto
- **useMemo / useCallback** — otimização de re-renderizações
- **useEffect** — sincronização com a API ao mudar o período
- **Promise.all** — chamadas paralelas à API
- **Componentes reutilizáveis** — `StatCard`, `CampaignTable`, `CampaignModal`
- **Estados de UI** — loading, error e empty states em todas as páginas

---
