import { useQuery } from '@tanstack/react-query'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getProdutos } from '@/service/produtoservice'
import { ProdutosDialogs } from './components/produtos-dialogs'
import { ProdutosPrimaryButtons } from './components/produtos-primary-buttons'
import { ProdutosProvider } from './components/produtos-provider'
import { ProdutosTable } from './components/produtos-table'

export function Produtos() {
  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => getProdutos(),
  })

  return (
    <ProdutosProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Produtos</h2>
            <p className='text-muted-foreground'>Gerencie o catálogo de produtos.</p>
          </div>
          <ProdutosPrimaryButtons />
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center text-muted-foreground'>
            Carregando produtos...
          </div>
        ) : (
          <ProdutosTable data={produtos} />
        )}
      </Main>

      <ProdutosDialogs />
    </ProdutosProvider>
  )
}
