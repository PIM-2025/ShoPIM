import { ClientesActionDialog } from './clientes-action-dialog'
import { ClientesDeleteDialog } from './clientes-delete-dialog'
import { useClientes } from './clientes-provider'

export function ClientesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useClientes()

  const closeWithDelay = (dialogSetter: () => void) => {
    dialogSetter()
    setTimeout(() => setCurrentRow(null), 500)
  }

  return (
    <>
      <ClientesActionDialog
        key='cliente-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <ClientesActionDialog
            key={`cliente-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => closeWithDelay(() => setOpen('edit'))}
            currentRow={currentRow}
          />
          <ClientesDeleteDialog
            key={`cliente-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => closeWithDelay(() => setOpen('delete'))}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
