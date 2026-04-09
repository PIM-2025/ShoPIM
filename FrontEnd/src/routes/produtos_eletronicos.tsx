import { createFileRoute } from '@tanstack/react-router'
import ProdutosEletronicos from '@/pages/produtos_eletronicos'

export const Route = createFileRoute('/produtos_eletronicos')({
  component: ProdutosEletronicos,
})
