import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { UltimoCliente } from '@/service/dashboardService'

interface Props {
  clientes: UltimoCliente[]
}

export function RecentSales({ clientes }: Props) {
  return (
    <div className='space-y-6'>
      {clientes.map((c) => (
        <div key={c.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {(c.nome ?? '?').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>{c.nome}</p>
              <p className='text-sm text-muted-foreground'>{c.email}</p>
            </div>
            <div className='text-xs text-muted-foreground'>
              {c.dataCadastro
                ? format(new Date(c.dataCadastro), "d MMM 'de' yyyy", { locale: ptBR })
                : '—'}
            </div>
          </div>
        </div>
      ))}
      {clientes.length === 0 && (
        <p className='text-center text-sm text-muted-foreground'>Nenhum cliente cadastrado ainda.</p>
      )}
    </div>
  )
}
