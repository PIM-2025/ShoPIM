'use client'

import { AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { updateProdutoStatus } from '@/service/produtoservice'
import { type Produto } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Produto
}

export function ProdutosStatusDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => updateProdutoStatus(currentRow.id, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      toast.success('Produto marcado como inativo!')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao inativar produto.')
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => mutation.mutate()}
      disabled={mutation.isPending}
      title={
        <span className='text-amber-600'>
          <AlertTriangle className='me-1 inline-block stroke-amber-600' size={18} />
          {' '}Marcar Produto como Inativo
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            Deseja marcar <span className='font-bold'>{currentRow.descricao}</span> como inativo?
            <br />
            O produto ficará com estoque zerado.
          </p>
          <Alert>
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>Você pode reativar depois editando o estoque do produto.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Marcar inativo'
    />
  )
}
