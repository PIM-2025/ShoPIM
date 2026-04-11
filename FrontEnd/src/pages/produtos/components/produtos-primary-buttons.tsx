import { PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProdutos } from './produtos-provider'

export function ProdutosPrimaryButtons() {
  const { setOpen } = useProdutos()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Novo Produto</span> <PackagePlus size={18} />
    </Button>
  )
}
