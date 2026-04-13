import { api } from './api'

export interface ClienteMes {
  mes: string
  total: number
}

export interface ReceitaMes {
  mes: string
  total: number
}

export interface UltimoCliente {
  id: number
  nome: string
  email: string
  dataCadastro: string
}

export interface UltimoPedido {
  id: number
  status: string
  dataPedido: string
  total: number
  cliente: { nome: string; email: string } | null
}

export interface ProdutoMaisVendido {
  idProduto: number
  descricao: string
  imagem: string | null
  totalUnidades: number
  receitaGerada: number
}

export interface PedidoStatus {
  status: string
  total: number
}

export interface DashboardStats {
  totalClientes: number
  totalProdutos: number
  conversasAbertas: number
  totalPedidos: number
  pedidosPendentes: number
  receitaTotal: number
  ticketMedio: number
  clientesPorMes: ClienteMes[]
  ultimosClientes: UltimoCliente[]
  receitaPorMes: ReceitaMes[]
  ultimosPedidos: UltimoPedido[]
  produtosMaisVendidos: ProdutoMaisVendido[]
  pedidosPorStatus: PedidoStatus[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats')
  return data
}
