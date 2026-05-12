import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Produto } from '../data/schema'

type ProdutosDialogType = 'add' | 'edit' | 'delete' | 'status'

type ProdutosContextType = {
  open: ProdutosDialogType | null
  setOpen: (str: ProdutosDialogType | null) => void
  currentRow: Produto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Produto | null>>
}

const ProdutosContext = React.createContext<ProdutosContextType | null>(null)

export function ProdutosProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProdutosDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Produto | null>(null)

  return (
    <ProdutosContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProdutosContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProdutos = () => {
  const ctx = React.useContext(ProdutosContext)
  if (!ctx) throw new Error('useProdutos must be used within <ProdutosProvider>')
  return ctx
}
