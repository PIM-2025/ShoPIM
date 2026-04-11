import { ProdutosActionDialog } from './produtos-action-dialog'
import { ProdutosDeleteDialog } from './produtos-delete-dialog'
import { useProdutos } from './produtos-provider'

export function ProdutosDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProdutos()

  const closeWithDelay = (dialogSetter: () => void) => {
    dialogSetter()
    setTimeout(() => setCurrentRow(null), 500)
  }

  return (
    <>
      <ProdutosActionDialog
        key='produto-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <ProdutosActionDialog
            key={`produto-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => closeWithDelay(() => setOpen('edit'))}
            currentRow={currentRow}
          />
          <ProdutosDeleteDialog
            key={`produto-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => closeWithDelay(() => setOpen('delete'))}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
