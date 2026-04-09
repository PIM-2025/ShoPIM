import { produtosMock } from '@/mocks/produtos'
import { Categoria, Produto } from '@/types/produtos'

// Quando tiver backend, basta trocar o corpo dessas funções
export async function getProdutos(categoria?: Categoria): Promise<Produto[]> {
  // futuro: return api.get(`/produtos?categoria=${categoria}`)
  await new Promise((r) => setTimeout(r, 400)) // simula latência
  if (!categoria) return produtosMock
  return produtosMock.filter((p) => p.categoria === categoria)
}
