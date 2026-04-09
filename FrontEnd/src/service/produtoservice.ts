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
