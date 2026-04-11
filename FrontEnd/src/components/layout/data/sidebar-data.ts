import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  MessagesSquare,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Package,
  ShoppingCart,
  UsersRound,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,      
      plan: 'Empresarial',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Geral',
      items: [
        {
          title: 'Painel',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Pedidos',
          url: '/pedidos',
          icon: ShoppingCart,
        },
        {
          title: 'Conversas',
          url: '/chats',
          icon: MessagesSquare,
        },
        {
          title: 'Usuários',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Produtos',
          url: '/produtos',
          icon: Package,
        },
        {
          title: 'Clientes',
          url: '/clientes',
          icon: UsersRound,
        },
      ],
    },
    {
      title: 'Outro',
      items: [
        {
          title: 'Configurações',
          icon: Settings,
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Conta',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Aparência',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notificações',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Exibição',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Central de Ajuda',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
