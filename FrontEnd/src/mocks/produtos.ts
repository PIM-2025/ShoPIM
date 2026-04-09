import { Produto } from '@/types/produtos'

export const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Tênis Nike',
    preco: 299.9,
    categoria: 'roupas',
    imagem:
      'https://http2.mlstatic.com/D_NQ_NP_2X_604949-MLB100975386367_122025-F-tnis-nike-quest-6-masculino.webp',
    emEstoque: true,
  },
  {
    id: 2,
    nome: 'Camiseta',
    preco: 79.9,
    categoria: 'roupas',
    imagem:
      'https://http2.mlstatic.com/D_NQ_NP_2X_629175-MLB105997289209_012026-F-camisa-social-masculina-slim-premium-manga-longa-curta.webp',
    emEstoque: true,
  },
  {
    id: 3,
    nome: 'IPhone 15 (250 GB)',
    preco: 6389.9,
    categoria: 'eletronicos',
    imagem:
      'https://http2.mlstatic.com/D_NQ_NP_2X_972898-MLA95936460027_102025-F.webp',
    emEstoque: true,
  },
  {
    id: 4,
    nome: 'Relogio',
    preco: 199.89,
    categoria: 'eletronicos',
    imagem:
      'https://http2.mlstatic.com/D_NQ_NP_2X_682402-MLA99403901858_112025-F.webp',
    emEstoque: true,
  },
]
