import { useQuery } from '@tanstack/react-query'
import { useLayout } from '@/context/layout-provider'
import { api } from '@/service/api'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { StoreBrand } from './store-brand'

interface Badges {
  conversasAbertas: number
  pedidosPendentes: number
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  const { data: badges } = useQuery<Badges>({
    queryKey: ['sidebar-badges'],
    queryFn: async () => {
      const { data } = await api.get<Badges>('/dashboard/badges')
      return data
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

  const navGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if ('url' in item) {
        if (item.url === '/pedidos' && badges?.pedidosPendentes) {
          return { ...item, badge: String(badges.pedidosPendentes) }
        }
        if (item.url === '/chats' && badges?.conversasAbertas) {
          return { ...item, badge: String(badges.conversasAbertas) }
        }
      }
      return item
    }),
  }))

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <StoreBrand />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
