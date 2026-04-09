export type Categoria = 'eletronicos' | 'roupas' | 'acessorios'

export interface Produto {
  id: number
  nome: string
  preco: number
  categoria: Categoria
  imagem: string
  emEstoque: boolean
}
