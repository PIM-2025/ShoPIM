// src/hooks/useProdutos.ts
import { useEffect, useState } from 'react'
import { getProdutos } from '@/service/produtoservice'
import { Categoria, Produto } from '@/types/produtos'

export type OrdemTipo = 'relevancia' | 'menor-preco' | 'maior-preco'

export function useProdutos(categoria?: Categoria) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [ordem, setOrdem] = useState<OrdemTipo>('relevancia')
  const [soEstoque, setSoEstoque] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProdutos(categoria).then((data) => {
      setProdutos(data)
      setLoading(false)
    })
  }, [categoria])

  const produtosFiltrados = produtos
    .filter((p) => (soEstoque ? p.emEstoque : true))
    .sort((a, b) => {
      if (ordem === 'menor-preco') return a.preco - b.preco
      if (ordem === 'maior-preco') return b.preco - a.preco
      return 0
    })

  return {
    produtos: produtosFiltrados,
    loading,
    ordem,
    setOrdem,
    soEstoque,
    setSoEstoque,
  }
}
