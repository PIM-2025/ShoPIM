import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getPedido } from '@/service/pedidoService'

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

interface Props {
  pedidoId: number | null
  open: boolean
  onClose: () => void
}

export function PedidoItensSheet({ pedidoId, open, onClose }: Props) {
  const { data: pedido, isLoading } = useQuery({
    queryKey: ['pedido', pedidoId],
    queryFn: () => getPedido(pedidoId!),
    enabled: pedidoId !== null && open,
  })

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg'>
        <SheetHeader className='border-b px-6 py-4'>
          <SheetTitle className='flex items-center gap-3'>
            Pedido #{pedidoId}
            {pedido && (
              <Badge variant='outline' className={cn('text-xs', STATUS_CLASS[pedido.status])}>
                {STATUS_LABEL[pedido.status] ?? pedido.status}
              </Badge>
            )}
          </SheetTitle>
          {pedido && (
            <p className='text-sm text-muted-foreground'>
              {format(new Date(pedido.dataPedido), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center py-12'>
            <Loader2 size={24} className='animate-spin text-muted-foreground' />
          </div>
        ) : pedido ? (
          <div className='flex flex-col gap-6 px-6 py-5'>
            {/* Endereço */}
            {pedido.endereco && (
              <div>
                <p className='mb-2 flex items-center gap-1.5 text-sm font-medium'>
                  <MapPin size={14} className='text-muted-foreground' />
                  Endereço de entrega
                </p>
                <p className='text-sm text-muted-foreground'>
                  {pedido.endereco.rua}, {pedido.endereco.numero}
                  {pedido.endereco.complemento ? ` — ${pedido.endereco.complemento}` : ''}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {pedido.endereco.cidade} — {pedido.endereco.estado},{' '}
                  {pedido.endereco.cep}
                </p>
              </div>
            )}

            {pedido.endereco && <Separator />}

            {/* Itens */}
            <div>
              <p className='mb-3 text-sm font-medium'>
                Itens do pedido ({pedido.itens.length})
              </p>
              <div className='space-y-3'>
                {pedido.itens.map((item, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted'>
                      {item.imagem ? (
                        <img
                          src={item.imagem}
                          alt={item.descricao}
                          className='h-full w-full object-contain'
                        />
                      ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{item.descricao}</p>
                      <p className='text-xs text-muted-foreground'>
                        {item.quantidade}× R$ {item.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p className='shrink-0 text-sm font-medium'>
                      R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>Total do pedido</p>
              <p className='text-lg font-bold'>R$ {pedido.total.toFixed(2)}</p>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
