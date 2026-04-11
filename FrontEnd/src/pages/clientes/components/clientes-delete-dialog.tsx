'use client'

import { AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteCliente } from '@/service/clienteService'
import { type Cliente } from '../data/schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Cliente
}

export function ClientesDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteCliente(currentRow.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      toast.success('Cliente excluído com sucesso!')
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao excluir cliente.')
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
          {' '}Excluir Cliente
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            Tem certeza que deseja excluir{' '}
            <span className='font-bold'>{currentRow.nome}</span>?
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
