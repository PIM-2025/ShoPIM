import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import { getConfiguracao } from '@/service/configuracaoService'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function StoreBrand() {
  const { data } = useQuery({
    queryKey: ['configuracao'],
    queryFn: getConfiguracao,
    staleTime: 5 * 60_000,
  })

  const nome = data?.nome ?? 'Minha Loja'
  const logoUrl = data?.logoUrl

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link to='/dashboard'>
            <div className='flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              {logoUrl ? (
                <img src={logoUrl} alt={nome} className='size-full object-cover' />
              ) : (
                <Store className='size-4' />
              )}
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{nome}</span>
              <span className='truncate text-xs text-sidebar-foreground/60'>Painel Admin</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
