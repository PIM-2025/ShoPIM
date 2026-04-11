import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { categorias } from '../data/data'
import { type Produto } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const produtosColumns: ColumnDef<Produto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Selecionar todos'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Selecionar linha'
        className='translate-y-[2px]'
      />
    ),
    meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'descricao',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Descrição' />,
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>{row.getValue('descricao')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'preco',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Preço' />,
    cell: ({ row }) => {
      const preco: number = row.getValue('preco')
      return (
        <div className='ps-2'>
          {preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      )
    },
  },
  {
    accessorKey: 'categoria',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Categoria' />,
    cell: ({ row }) => {
      const cat = categorias.find((c) => c.value === row.getValue('categoria'))
      return (
        <div className='flex items-center gap-x-2'>
          {cat?.icon && <cat.icon size={16} className='text-muted-foreground' />}
          <span className='capitalize'>{cat?.label ?? row.getValue('categoria')}</span>
        </div>
      )
    },
    meta: { className: 'max-md:hidden' },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'quantidade',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Estoque' />,
    cell: ({ row }) => <div className='ps-2'>{row.getValue('quantidade')}</div>,
    meta: { className: 'max-md:hidden' },
  },
  {
    accessorKey: 'imagem',
    header: () => <span className='ps-2'>Imagem</span>,
    cell: ({ row }) => {
      const url: string = row.getValue('imagem')
      return url ? (
        <img src={url} alt='produto' className='h-10 w-10 rounded object-cover' />
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
      )
    },
    meta: { className: 'max-md:hidden' },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
