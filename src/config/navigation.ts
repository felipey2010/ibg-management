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
      { label: "Painel", href: "/", icon: LayoutDashboard, available: true },
      {
        label: "Membros",
        href: "/membros",
        permission: "members.read",
        icon: UsersRound,
        available: true,
      },
      {
        label: "Ministérios",
        href: "/ministerios",
        permission: "ministries.read",
        icon: UserRound,
        available: true,
      },
      {
        label: "Avisos",
        href: "/avisos",
        permission: "announcements.read",
        icon: Megaphone,
        available: true,
      },
      {
        label: "Eventos",
        href: "/eventos",
        permission: "events.read",
        icon: CalendarDays,
        available: true,
      },
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
        permission: "church.settings.update",
        icon: Settings,
        available: true,
      },
      {
        label: "Usuários",
        href: "/configuracoes/usuarios",
        permission: "*",
        icon: ShieldCheck,
        available: true,
      },
      {
        label: "Perfis e permissões",
        href: "/configuracoes/permissoes",
        permission: "*",
        icon: ShieldCheck,
        available: true,
      },
    ],
  },
] as const;

export const headerActions = [{ label: "Notificações", icon: BellRing }] as const;
