import { createFileRoute } from '@tanstack/react-router'
import { PaginaProdutos } from '@/features/paginaProdutos'

export const Route = createFileRoute('/produtos')({
  component: PaginaProdutos,
})