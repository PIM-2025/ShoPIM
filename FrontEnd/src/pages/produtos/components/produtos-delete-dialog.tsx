'use client'

import { AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteProduto } from '@/service/produtoservice'
import { type Produto } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Produto
}

export function ProdutosDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteProduto(currentRow.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      toast.success('Produto excluído com sucesso!')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao excluir produto.')
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => mutation.mutate()}
      disabled={mutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />
          {' '}Excluir Produto
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            Tem certeza que deseja excluir{' '}
            <span className='font-bold'>{currentRow.descricao}</span>?
            <br />
            Esta ação não pode ser desfeita.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>Esta operação é irreversível.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Excluir'
      destructive
    />
  )
}
