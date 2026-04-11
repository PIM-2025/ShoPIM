import { useQuery } from '@tanstack/react-query'
import { getClientes } from '@/service/clienteService'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClientesDialogs } from './components/clientes-dialogs'
import { ClientesPrimaryButtons } from './components/clientes-primary-buttons'
import { ClientesProvider } from './components/clientes-provider'
import { ClientesTable } from './components/clientes-table'

export function Clientes() {
  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const data = await getClientes()
      return data.map((c) => ({
        ...c,
        dataCadastro: c.dataCadastro ? new Date(c.dataCadastro) : null,
      }))
    },
  })

  return (
    <ClientesProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Clientes</h2>
            <p className='text-muted-foreground'>
              Gerencie os clientes cadastrados.
            </p>
          </div>
          <ClientesPrimaryButtons />
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center text-muted-foreground'>
            Carregando clientes...
          </div>
        ) : (
          <ClientesTable data={clientes} />
        )}
      </Main>

      <ClientesDialogs />
    </ClientesProvider>
  )
}
