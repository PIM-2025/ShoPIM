import { api } from './api'

export interface ItemPedido {
  idProduto: number
  quantidade: number
  precoUnitario: number
  descricao: string
  imagem: string
}

export interface EnderecoEntrega {
  rua: string
  numero: string
  complemento?: string
  cidade: string
  estado: string
  cep: string
}

export interface Pedido {
  id: number
  status: 'pendente' | 'processando' | 'enviado' | 'concluído' | 'cancelado'
  dataPedido: string
  total: number
  totalItens?: number
  endereco?: EnderecoEntrega | null
  itens: ItemPedido[]
}

export interface CriarPedidoPayload {
  idUsuario: number
  rua: string
  numero: string
  complemento?: string
  cidade: string
  estado: string
  cep: string
}

export async function criarPedido(payload: CriarPedidoPayload): Promise<{ id: number }> {
  const { data } = await api.post<{ id: number }>('/pedido', payload)
  return data
}

export async function getMeusPedidos(idUsuario: number): Promise<Pedido[]> {
  const { data } = await api.get<Pedido[]>(`/pedido/meus/${idUsuario}`)
  return data
}

export async function getPedido(id: number): Promise<Pedido> {
  const { data } = await api.get<Pedido>(`/pedido/${id}`)
  return data
}

export interface PedidoAdmin {
  id: number
  status: string
  dataPedido: string
  total: number
  totalItens: number
  cliente: { id: number; name: string; email: string } | null
}

export async function getTodosPedidos(): Promise<PedidoAdmin[]> {
  const { data } = await api.get<PedidoAdmin[]>('/pedido/todos')
  return data
}

export async function atualizarStatusPedido(id: number, status: string): Promise<void> {
  await api.patch(`/pedido/${id}/status`, { status })
}

export async function getEnderecoUsuario(idUsuario: number): Promise<EnderecoEntrega | null> {
  try {
    const { data, status } = await api.get<EnderecoEntrega>(`/pedido/endereco/${idUsuario}`)
    if (status === 204) return null
    return data
  } catch {
    return null
  }
}
