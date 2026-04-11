import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTodosPedidos } from '@/service/pedidoService'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PedidosTable } from './components/pedidos-table'
import { PedidoItensSheet } from './components/pedido-itens-sheet'

export function Pedidos() {
  const { data: pedidos = [], isLoading } = useQuery({
    queryKey: ['pedidos-admin'],
    queryFn: getTodosPedidos,
  })
  const [pedidoItensId, setPedidoItensId] = useState<number | null>(null)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Pedidos</h2>
          <p className='text-muted-foreground'>
            Gerencie e atualize o status dos pedidos.
          </p>
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center text-muted-foreground'>
            Carregando pedidos...
          </div>
        ) : (
          <PedidosTable data={pedidos} onVerItens={setPedidoItensId} />
        )}
      </Main>

      <PedidoItensSheet
        pedidoId={pedidoItensId}
        open={pedidoItensId !== null}
        onClose={() => setPedidoItensId(null)}
      />
    </>
  )
}
