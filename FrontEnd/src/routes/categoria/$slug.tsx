import { createFileRoute } from '@tanstack/react-router'
import { CategoriaProdutosPage } from '@/pages/CategoriaProdutosPage'

export const Route = createFileRoute('/categoria/$slug')({
  component: CategoriaProdutosPage,
})
