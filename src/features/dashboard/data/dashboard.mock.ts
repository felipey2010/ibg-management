import type {
  AttentionItem,
  ContributionCampaign,
  DashboardMetric,
  RecentActivity,
  UpcomingEvent,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Membros ativos", value: "342", detail: "↑ 12 este mês", tone: "success" },
  { label: "Ministérios ativos", value: "9", detail: "sem alteração", tone: "neutral" },
  { label: "Eventos esta semana", value: "4", detail: "2 esta noite", tone: "neutral" },
  { label: "Aprovações pendentes", value: "5", detail: "requer ação", tone: "warning" },
];

export const attentionItems: AttentionItem[] = [
  {
    id: "pending-users",
    kind: "approval",
    title: "5 cadastros aguardando aprovação",
    detail: "O mais antigo é de há 3 dias — Lucas Martins, Beatriz Rocha…",
    action: "Revisar",
  },
  {
    id: "low-stock",
    kind: "inventory",
    title: "Estoque baixo — Copos descartáveis",
    detail: "12 restantes de um mínimo de 50 unidades",
    action: "Ver item",
  },
  {
    id: "campaign-ending",
    kind: "campaign",
    title: "Campanha “Reforma do Templo” encerra em 6 dias",
    detail: "62,5% da meta atingida — R$ 12.500 de R$ 20.000",
    action: "Ver campanha",
  },
  {
    id: "documents-review",
    kind: "document",
    title: "2 documentos aguardando revisão",
    detail: "Enviados pelo Ministério de Jovens",
    action: "Abrir",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "worship",
    day: "08",
    weekday: "Hoje",
    title: "Culto de Celebração",
    location: "Templo principal",
    time: "19h30",
    isToday: true,
  },
  {
    id: "school",
    day: "09",
    weekday: "Dom",
    title: "Escola Bíblica Dominical",
    location: "Salas de EBD",
    time: "10h00",
  },
  {
    id: "leaders",
    day: "11",
    weekday: "Ter",
    title: "Reunião de Líderes",
    location: "Sala de reuniões",
    time: "20h00",
  },
  {
    id: "study",
    day: "13",
    weekday: "Qui",
    title: "Estudo Bíblico: Vida em Comunidade",
    location: "Salão social",
    time: "20h00",
  },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "approval",
    description: "Débora F. aprovou o cadastro de Lucas Martins",
    timeAgo: "há 12 min",
    highlighted: true,
  },
  {
    id: "announcement",
    description: "Novo aviso publicado: “Inscrições abertas — Conferência de Famílias”",
    timeAgo: "há 1 h",
  },
  {
    id: "inventory",
    description: "Carlos M. registrou saída de estoque: 20 cadeiras dobráveis",
    timeAgo: "há 2 h",
  },
  {
    id: "donation",
    description: "Contribuição recebida: R$ 250,00 — Campanha Reforma do Templo",
    timeAgo: "há 3 h",
    highlighted: true,
  },
];

export const contributionCampaigns: ContributionCampaign[] = [
  {
    id: "renovation",
    title: "Reforma do Templo",
    type: "Financeira",
    summary: "R$ 12.500,00 de R$ 20.000,00 — 62,5%",
    progress: 62.5,
    footerStart: "Encerra em 6 dias",
    footerEnd: "48 contribuintes",
    tone: "brand",
  },
  {
    id: "dinner",
    title: "Jantar da Igreja — Refrigerantes",
    type: "Itens",
    summary: "24 de 30 unidades comprometidas — 6 restantes",
    progress: 80,
    footerStart: "8 de 10 contribuintes",
    footerEnd: "Encerra em 3 dias",
    tone: "success",
  },
];
