import {
  BellRing,
  BookOpen,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

export const navigationGroups = [
  {
    label: "Principal",
    items: [
      { label: "Painel", href: "/dashboard", icon: LayoutDashboard, available: true },
      { label: "Membros", href: "/membros", icon: UsersRound, available: false },
      { label: "Ministérios", href: "/ministerios", icon: UserRound, available: false },
      { label: "Avisos", href: "/avisos", icon: Megaphone, available: false },
      { label: "Eventos", href: "/eventos", icon: CalendarDays, available: false },
    ],
  },
  {
    label: "Gestão",
    items: [
      { label: "Estoque", href: "/estoque", icon: Boxes, available: false },
      {
        label: "Contribuições",
        href: "/contribuicoes",
        icon: CircleDollarSign,
        available: false,
      },
      {
        label: "Estudos Bíblicos",
        href: "/estudos-biblicos",
        icon: BookOpen,
        available: false,
      },
      { label: "Documentos", href: "/documentos", icon: FileText, available: false },
    ],
  },
  {
    label: "Administração",
    items: [
      {
        label: "Configurações da igreja",
        href: "/configuracoes/igreja",
        icon: Settings,
        available: false,
      },
      {
        label: "Usuários e permissões",
        href: "/configuracoes/usuarios",
        icon: ShieldCheck,
        available: false,
        badge: 5,
      },
    ],
  },
] as const;

export const headerActions = [{ label: "Notificações", icon: BellRing }] as const;
