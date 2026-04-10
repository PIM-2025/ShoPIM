import { api } from '@/service/api'

export interface CartItem {
  id: number
  idUsuario: number
  idProduto: number
  quantidade: number
  dataAdicao: string
  produto: {
    id: number
    descricao: string
    preco: number
    imagem: string
    categoria: string
  }
}

export async function getCart(idUsuario: number): Promise<CartItem[]> {
  const { data } = await api.get<CartItem[]>(`/Cart/${idUsuario}`)
  return data
}

export async function adicionarItem(
  idUsuario: number,
  idProduto: number,
  quantidade = 1
) {
  const { data } = await api.post('/Cart', { idUsuario, idProduto, quantidade })
  return data
}

export async function atualizarQuantidade(id: number, quantidade: number) {
  await api.put(`/Cart/${id}`, { id, quantidade })
}

export async function removerItem(id: number) {
  await api.delete(`/Cart/${id}`)
}

export async function limparCarrinho(idUsuario: number) {
  await api.delete(`/Cart/limpar/${idUsuario}`)
}
