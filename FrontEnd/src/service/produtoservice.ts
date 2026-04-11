import { api } from '@/service/api'
import { Categoria, Produto } from '@/types/produtos'

export async function getProdutos(categoria?: Categoria): Promise<Produto[]> {
  const { data } = await api.get<Produto[]>('/Product', {
    params: categoria ? { categoria } : undefined,
  })
  return data
}

export async function getProduto(id: number): Promise<Produto> {
  const { data } = await api.get<Produto>(`/Product/${id}`)
  return data
}

export async function createProduto(produto: Omit<Produto, 'id'>): Promise<Produto> {
  const { data } = await api.post<Produto>('/Product', { ...produto, id: 0 })
  return data
}

export async function updateProduto(id: number, produto: Produto): Promise<void> {
  await api.put(`/Product/${id}`, produto)
}

export async function deleteProduto(id: number): Promise<void> {
  await api.delete(`/Product/${id}`)
}
