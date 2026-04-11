import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Package,
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
          title: 'Tarefas',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Conversas',
          url: '/chats',
          badge: '3',
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
        }
      ],
    },
    {
      title: 'Páginas',
      items: [
        {
          title: 'Autenticação',
          icon: ShieldCheck,
          items: [
            {
              title: 'Entrar',
              url: '/sign-in',
            },
            {
              title: 'Entrar (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Cadastrar',
              url: '/sign-up',
            },
            {
              title: 'Esqueceu a Senha',
              url: '/forgot-password',
            },
            {
              title: 'OTP',              
              url: '/otp',
            },
          ],
        },
        {
          title: 'Erros',
          icon: Bug,
          items: [
            {
              title: 'Não Autorizado',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Proibido',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Não Encontrado',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Erro Interno do Servidor',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Erro de Manutenção',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
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
