import { createFileRoute } from '@tanstack/react-router'
import { ProdutoDetalhe } from '@/features/paginaProdutos/produtosDetalhe'

export const Route = createFileRoute('/paginaProdutos')({
  component: ProdutoDetalhe,
})