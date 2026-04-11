import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { roleOptions, statusOptions, statusStyles } from '../data/data'
import { type Cliente } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const clientesColumns: ColumnDef<Cliente>[] = [
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
    accessorKey: 'nome',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nome' />,
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3'>{row.getValue('nome')}</LongText>
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
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='E-mail' />,
    cell: ({ row }) => (
      <div className='ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
    meta: { className: 'max-md:hidden' },
  },
  {
    accessorKey: 'cpf',
    header: ({ column }) => <DataTableColumnHeader column={column} title='CPF' />,
    cell: ({ row }) => (
      <div>{row.getValue('cpf') ?? <span className='text-muted-foreground'>—</span>}</div>
    ),
    meta: { className: 'max-md:hidden' },
    enableSorting: false,
  },
  {
    accessorKey: 'dataCadastro',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cadastro' />,
    cell: ({ row }) => {
      const raw = row.getValue<Date | null>('dataCadastro')
      if (!raw) return <span className='text-muted-foreground'>—</span>
      const date = raw instanceof Date ? raw : new Date(raw)
      return <div>{isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR')}</div>
    },
    meta: { className: 'max-md:hidden' },
  },
  {
    accessorKey: 'ativo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const ativo: number = row.getValue('ativo')
      const label = statusOptions.find((s) => s.value === String(ativo))?.label ?? String(ativo)
      const badgeColor = statusStyles.get(ativo)
      return (
        <Badge variant='outline' className={cn('capitalize', badgeColor)}>
          {label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Perfil' />,
    cell: ({ row }) => {
      const role: number = row.getValue('role')
      const label = roleOptions.find((r) => r.value === String(role))?.label ?? String(role)
      return <div className='text-sm'>{label}</div>
    },
    meta: { className: 'max-md:hidden' },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
