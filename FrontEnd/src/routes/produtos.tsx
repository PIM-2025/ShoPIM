import { createFileRoute } from '@tanstack/react-router'
import PaginaProdutos from '@/pages/paginaProdutos'

export const Route = createFileRoute('/produtos')({
  component: PaginaProdutos,
})
