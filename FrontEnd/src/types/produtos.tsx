export type Categoria = 'eletronicos' | 'roupas' | 'acessorios'

export interface Produto {
  id: number
  descricao: string // era 'nome'
  preco: number
  categoria: string
  quantidade: number // era 'emEstoque'
  imagem: string
}
