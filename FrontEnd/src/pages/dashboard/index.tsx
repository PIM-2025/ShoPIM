import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MessagesSquare,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { getDashboardStats } from '@/service/dashboardService'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  processando: 'Processando',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const STATUS_CLASS: Record<string, string> = {
  pendente: 'border-yellow-300 bg-yellow-100/30 text-yellow-800 dark:text-yellow-300',
  processando: 'border-blue-300 bg-blue-100/30 text-blue-800 dark:text-blue-300',
  enviado: 'border-purple-300 bg-purple-100/30 text-purple-800 dark:text-purple-300',
  entregue: 'border-green-300 bg-green-100/30 text-green-800 dark:text-green-300',
  cancelado: 'border-red-300 bg-red-100/30 text-red-800 dark:text-red-300',
}

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
                <TabsTrigger value='vendas'>Vendas</TabsTrigger>
                <TabsTrigger value='clientes'>Clientes</TabsTrigger>
              </TabsList>
            </div>

            {/* ── VISÃO GERAL ── */}
            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Receita Total</CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      R$ {(stats?.receitaTotal ?? 0).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>pedidos não cancelados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total de Pedidos</CardTitle>
                    <ShoppingCart className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.totalPedidos ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>
                      {stats?.pedidosPendentes ?? 0} pendente(s)
                    </p>
                  </CardContent>
                </Card>

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
                    <CardTitle className='text-sm font-medium'>Conversas Abertas</CardTitle>
                    <MessagesSquare className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.conversasAbertas ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>atendimentos em andamento</p>
                  </CardContent>
                </Card>
              </div>

              <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                  <CardHeader>
                    <CardTitle>Receita por Mês</CardTitle>
                    <CardDescription>Receita dos últimos 12 meses (excluindo cancelados)</CardDescription>
                  </CardHeader>
                  <CardContent className='ps-2'>
                    <ResponsiveContainer width='100%' height={350}>
                      <BarChart data={stats?.receitaPorMes ?? []}>
                        <XAxis dataKey='mes' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke='#888888'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `R$${Number(v).toFixed(0)}`}
                        />
                        <Tooltip
                          formatter={(value) => [`R$ ${Number(value ?? 0).toFixed(2)}`, 'Receita']}
                          cursor={{ fill: 'hsl(var(--muted))' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            color: 'hsl(var(--popover-foreground))',
                            fontSize: '12px',
                          }}
                          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                          labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        />
                        <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className='col-span-1 lg:col-span-3'>
                  <CardHeader>
                    <CardTitle>Últimos Pedidos</CardTitle>
                    <CardDescription>Os 5 pedidos mais recentes</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {(stats?.ultimosPedidos ?? []).map((p) => (
                      <div key={p.id} className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                          <AvatarFallback>
                            {(p.cliente?.nome ?? '#').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-1 flex-wrap items-center justify-between gap-1'>
                          <div>
                            <p className='text-sm font-medium leading-none'>
                              {p.cliente?.nome ?? 'Cliente'}
                            </p>
                            <p className='text-xs text-muted-foreground'>#{p.id}</p>
                          </div>
                          <div className='flex flex-col items-end gap-1'>
                            <Badge variant='outline' className={`text-xs ${STATUS_CLASS[p.status] ?? ''}`}>
                              {STATUS_LABEL[p.status] ?? p.status}
                            </Badge>
                            <span className='text-xs font-medium'>R$ {p.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(stats?.ultimosPedidos ?? []).length === 0 && (
                      <p className='text-center text-sm text-muted-foreground'>Nenhum pedido ainda.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── VENDAS ── */}
            <TabsContent value='vendas' className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Receita Total</CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      R$ {(stats?.receitaTotal ?? 0).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>excluindo cancelados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total de Pedidos</CardTitle>
                    <ShoppingCart className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.totalPedidos ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>todos os status</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
                    <TrendingUp className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      R$ {(stats?.ticketMedio ?? 0).toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>por pedido</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Pedidos Pendentes</CardTitle>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stats?.pedidosPendentes ?? '—'}</div>
                    <p className='text-xs text-muted-foreground'>aguardando processamento</p>
                  </CardContent>
                </Card>
              </div>

              <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                  <CardHeader>
                    <CardTitle>Receita por Mês</CardTitle>
                    <CardDescription>Receita dos últimos 12 meses (excluindo cancelados)</CardDescription>
                  </CardHeader>
                  <CardContent className='ps-2'>
                    <ResponsiveContainer width='100%' height={350}>
                      <BarChart data={stats?.receitaPorMes ?? []}>
                        <XAxis dataKey='mes' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke='#888888'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `R$${Number(v).toFixed(0)}`}
                        />
                        <Tooltip
                          formatter={(value) => [`R$ ${Number(value ?? 0).toFixed(2)}`, 'Receita']}
                          cursor={{ fill: 'hsl(var(--muted))' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            color: 'hsl(var(--popover-foreground))',
                            fontSize: '12px',
                          }}
                          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                          labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        />
                        <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className='col-span-1 lg:col-span-3'>
                  <CardHeader>
                    <CardTitle>Últimos Pedidos</CardTitle>
                    <CardDescription>Os 5 pedidos mais recentes</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {(stats?.ultimosPedidos ?? []).map((p) => (
                      <div key={p.id} className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                          <AvatarFallback>
                            {(p.cliente?.nome ?? '#').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-1 flex-wrap items-center justify-between gap-1'>
                          <div>
                            <p className='text-sm font-medium leading-none'>
                              {p.cliente?.nome ?? 'Cliente'}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {format(new Date(p.dataPedido), "d MMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <div className='flex flex-col items-end gap-1'>
                            <Badge variant='outline' className={`text-xs ${STATUS_CLASS[p.status] ?? ''}`}>
                              {STATUS_LABEL[p.status] ?? p.status}
                            </Badge>
                            <span className='text-xs font-medium'>R$ {p.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(stats?.ultimosPedidos ?? []).length === 0 && (
                      <p className='text-center text-sm text-muted-foreground'>Nenhum pedido ainda.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── CLIENTES ── */}
            <TabsContent value='clientes' className='space-y-4'>
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
                    <p className='text-xs text-muted-foreground'>produtos no catálogo</p>
                  </CardContent>
                </Card>
              </div>

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
