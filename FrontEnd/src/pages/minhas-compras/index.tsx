import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, PackageSearch, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth-store'
import { getMeusPedidos } from '@/service/pedidoService'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  processando: 'Processando',
  enviado: 'Enviado',
  concluído: 'Concluído',
  cancelado: 'Cancelado',
}

const STATUS_CLASS: Record<string, string> = {
  pendente: 'border-yellow-300 bg-yellow-100/30 text-yellow-800 dark:text-yellow-300',
  processando: 'border-blue-300 bg-blue-100/30 text-blue-800 dark:text-blue-300',
  enviado: 'border-purple-300 bg-purple-100/30 text-purple-800 dark:text-purple-300',
  concluído: 'border-green-300 bg-green-100/30 text-green-800 dark:text-green-300',
  cancelado: 'border-red-300 bg-red-100/30 text-red-800 dark:text-red-300',
}

export function MinhasCompras() {
  const { auth } = useAuthStore()
  const userId = auth.user?.id

  const { data: pedidos = [], isLoading } = useQuery({
    queryKey: ['meus-pedidos', userId],
    queryFn: () => getMeusPedidos(userId!),
    enabled: !!userId,
  })

  return (
    <div className='container mx-auto max-w-3xl px-4 py-10'>
      <div className='mb-6 flex items-center gap-3'>
        <ShoppingBag className='h-6 w-6' />
        <h1 className='text-2xl font-bold'>Meus Pedidos</h1>
      </div>

      {isLoading ? (
        <div className='flex min-h-[40vh] items-center justify-center'>
          <Loader2 size={28} className='animate-spin text-muted-foreground' />
        </div>
      ) : pedidos.length === 0 ? (
        <div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center'>
          <PackageSearch className='h-14 w-14 text-muted-foreground' />
          <p className='font-medium'>Você ainda não fez nenhum pedido.</p>
          <Button asChild><Link to='/'>Começar a comprar</Link></Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {pedidos.map((pedido) => (
            <Card key={pedido.id}>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>Pedido #{pedido.id}</CardTitle>
                  <Badge variant='outline' className={cn('text-xs', STATUS_CLASS[pedido.status])}>
                    {STATUS_LABEL[pedido.status] ?? pedido.status}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {format(new Date(pedido.dataPedido), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-2'>
                  {pedido.itens.slice(0, 2).map((item, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      {item.imagem ? (
                        <img src={item.imagem} alt={item.descricao} className='h-10 w-10 rounded object-cover' />
                      ) : (
                        <div className='h-10 w-10 rounded bg-muted' />
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='truncate text-sm'>{item.descricao}</p>
                        <p className='text-xs text-muted-foreground'>Qtd: {item.quantidade}</p>
                      </div>
                    </div>
                  ))}
                  {pedido.itens.length > 2 && (
                    <p className='text-xs text-muted-foreground'>+{pedido.itens.length - 2} item(ns)</p>
                  )}
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <p className='font-semibold'>R$ {pedido.total.toFixed(2)}</p>
                  <Button asChild size='sm' variant='outline'>
                    <Link to='/pedido/$id' params={{ id: String(pedido.id) }}>
                      Acompanhar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
