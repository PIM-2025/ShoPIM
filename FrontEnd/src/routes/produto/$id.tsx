import { createFileRoute } from '@tanstack/react-router'
import { ProdutoDetalhePage } from '@/pages/produto'

export const Route = createFileRoute('/produto/$id')({
  component: ProdutoDetalhePage,
})
