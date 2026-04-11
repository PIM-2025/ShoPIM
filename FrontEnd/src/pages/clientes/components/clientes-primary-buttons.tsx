import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClientes } from './clientes-provider'

export function ClientesPrimaryButtons() {
  const { setOpen } = useClientes()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Novo Cliente</span> <UserPlus size={18} />
    </Button>
  )
}
