export type Categoria = 'eletronicos' | 'roupas' | 'acessorios' | 'ofertas' | 'novidades'

export interface Produto {
  id: number
  descricao: string // era 'nome'
  preco: number
  categoria: string
  quantidade: number // era 'emEstoque'
  imagem: string
  descricaoDetalhada?: string
  imagens?: string   // URLs separadas por \n — dividir ao usar
}
