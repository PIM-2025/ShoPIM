import { type ColumnDef, type Row } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'
import { type PedidoAdmin, atualizarStatusPedido } from '@/service/pedidoService'

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

const STATUS_OPTIONS = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado']

function ActionsCell({
  row,
  onVerItens,
}: {
  row: Row<PedidoAdmin>
  onVerItens: (id: number) => void
}) {
  const pedido = row.original
  const queryClient = useQueryClient()

  const handleStatus = async (status: string) => {
    await atualizarStatusPedido(pedido.id, status)
    queryClient.invalidateQueries({ queryKey: ['pedidos-admin'] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-8'>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onVerItens(pedido.id)}>
          <Eye className='mr-2 size-4' />
          Ver itens
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.filter((s) => s !== pedido.status).map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleStatus(s)}>
            {STATUS_LABEL[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function createPedidosColumns(
  onVerItens: (id: number) => void
): ColumnDef<PedidoAdmin>[] {
  return createColumns(onVerItens)
}

function createColumns(onVerItens: (id: number) => void): ColumnDef<PedidoAdmin>[] {
  return [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Pedido' />,
    cell: ({ row }) => <span className='font-medium'>#{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'cliente',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cliente' />,
    cell: ({ row }) => {
      const cliente = row.getValue<PedidoAdmin['cliente']>('cliente')
      if (!cliente) return <span className='text-muted-foreground'>—</span>
      return (
        <div>
          <p className='text-sm font-medium'>{cliente.name}</p>
          <p className='text-xs text-muted-foreground'>{cliente.email}</p>
        </div>
      )
    },
    filterFn: (row, _, filterValue) => {
      const cliente = row.original.cliente
      if (!cliente) return false
      return (
        cliente.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filterValue.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'dataPedido',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Data' />,
    cell: ({ row }) => {
      const raw = row.getValue<string>('dataPedido')
      return (
        <span className='text-sm'>
          {format(new Date(raw), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </span>
      )
    },
    meta: { className: 'max-md:hidden' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return (
        <Badge variant='outline' className={cn('text-xs', STATUS_CLASS[status])}>
          {STATUS_LABEL[status] ?? status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'totalItens',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Itens' />,
    cell: ({ row }) => <span>{row.getValue('totalItens')}</span>,
    meta: { className: 'max-md:hidden' },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Total' />,
    cell: ({ row }) => (
      <span className='font-medium'>
        R$ {(row.getValue<number>('total')).toFixed(2)}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} onVerItens={onVerItens} />,
  },
  ]
}
