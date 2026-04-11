import { useQuery } from '@tanstack/react-query'
import { MessagesSquare, Package, Users, ShieldCheck, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { getDashboardStats } from '@/service/dashboardService'

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Painel</h1>
        </div>

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 size={28} className='animate-spin text-muted-foreground' />
          </div>
        ) : (
          <Tabs defaultValue='overview' className='space-y-4'>
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList>
                <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='overview' className='space-y-4'>
              {/* Cards de métricas */}
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total de Clientes</CardTitle>
                    <Users className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.totalClientes ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>usuários com perfil cliente</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total de Produtos</CardTitle>
                    <Package className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.totalProdutos ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>produtos cadastrados no catálogo</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Conversas Abertas</CardTitle>
                    <MessagesSquare className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.conversasAbertas ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>atendimentos em andamento</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Administradores</CardTitle>
                    <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.totalAdmins ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>usuários com perfil admin</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico + Últimos clientes */}
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                  <CardHeader>
                    <CardTitle>Clientes por Mês</CardTitle>
                    <CardDescription>Novos clientes cadastrados nos últimos 12 meses</CardDescription>
                  </CardHeader>
                  <CardContent className='ps-2'>
                    <Overview data={stats?.clientesPorMes ?? []} />
                  </CardContent>
                </Card>

                <Card className='col-span-1 lg:col-span-3'>
                  <CardHeader>
                    <CardTitle>Últimos Clientes</CardTitle>
                    <CardDescription>Os 5 clientes mais recentes cadastrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales clientes={stats?.ultimosClientes ?? []} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Main>
    </>
  )
}
