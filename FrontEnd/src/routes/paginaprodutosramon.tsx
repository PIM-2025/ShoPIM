import { createFileRoute } from '@tanstack/react-router'
import PaginaProduto from '@/pages/PaginaProdutosRamon'

export const Route = createFileRoute('/paginaprodutosramon')({
  component: PaginaProduto,
})
