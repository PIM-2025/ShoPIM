import { Produto } from '@/types/produtos'
import { Card } from '@/components/layout/cards'

export function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <Card title={produto.nome} price={produto.preco} image={produto.imagem} />
  )
}
