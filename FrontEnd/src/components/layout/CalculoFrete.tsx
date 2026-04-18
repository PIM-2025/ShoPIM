import { useState } from 'react'
import { Truck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFrete } from '@/hooks/useFrete'

function formatarCep(valor: string) {
  return valor.replace(/\D/g, '').slice(0, 8)
}

export function CalculoFrete() {
  const [cep, setCep] = useState('')
  const { resultado, carregando, erro, buscarFrete } = useFrete()

  function handleCalcular() {
    if (cep.length !== 8) return
    buscarFrete(cep)
  }

  return (
    <div className='rounded-xl border border-border bg-muted/20 p-6'>
      <h3 className='mb-4 flex items-center gap-2 text-base font-semibold text-foreground'>
        <Truck size={18} className='text-primary' />
        Calcular frete
      </h3>

      <div className='flex gap-2'>
        <Input
          placeholder='Digite seu CEP'
          value={cep.replace(/(\d{5})(\d)/, '$1-$2')}
          onChange={(e) => setCep(formatarCep(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && handleCalcular()}
          maxLength={9}
          className='max-w-[180px]'
        />
        <Button onClick={handleCalcular} disabled={cep.length !== 8 || carregando} size='sm'>
          {carregando ? <Loader2 size={16} className='animate-spin' /> : 'Calcular'}
        </Button>
      </div>

      {erro && <p className='mt-3 text-sm text-destructive'>{erro}</p>}

      {resultado && (
        <div className='mt-4 space-y-2'>
          {resultado.map((s) => (
            <div
              key={s.codigo}
              className='flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm'
            >
              <span className='font-medium'>{s.nome}</span>
              <span className='text-muted-foreground'>
                {s.prazoEntrega} dia{s.prazoEntrega !== 1 ? 's' : ''} úteis
              </span>
              <span className='font-semibold text-primary'>
                {s.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
