import { Produto } from '@/types/produtos'
import { Card } from '@/components/layout/cards'

export function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <Card
      title={produto.descricao}
      price={produto.preco}
      image={produto.imagem}
    />
  )
}
