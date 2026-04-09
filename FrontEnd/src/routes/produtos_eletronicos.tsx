import { createFileRoute } from '@tanstack/react-router'
import ProdutosEletronicos from '@/features/produtos_eletronicos'

export const Route = createFileRoute('/produtos_eletronicos')({
  component: ProdutosEletronicos,
})