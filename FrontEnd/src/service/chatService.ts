import * as signalR from '@microsoft/signalr'
import { api } from './api'

export interface Conversa {
  id: number
  nomeCliente: string
  clienteId?: number | null
  status: 'aberta' | 'fechada'
  criadoEm: string
  ultimaMensagem?: {
    conteudo: string
    remetenteTipo: string
    enviadoEm: string
  } | null
  totalMensagens: number
}

export interface Mensagem {
  id: number
  conversaId: number
  conteudo: string
  remetenteTipo: 'cliente' | 'admin'
  remetenteNome: string
  enviadoEm: string
}

// ─── Singleton connection ───────────────────────────────────────────────────
const HUB_URL = import.meta.env.VITE_API_URL?.replace('/api', '') + '/chatHub'

let _connection: signalR.HubConnection | null = null

export function getConnection(): signalR.HubConnection {
  if (!_connection) {
    _connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()
  }
  return _connection
}

export async function startConnection(): Promise<void> {
  const conn = getConnection()
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start()
  }
}

export async function stopConnection(): Promise<void> {
  if (_connection?.state !== signalR.HubConnectionState.Disconnected) {
    await _connection?.stop()
  }
}

// ─── Hub actions ────────────────────────────────────────────────────────────
export async function entrarConversa(conversaId: number): Promise<void> {
  await getConnection().invoke('EntrarConversa', String(conversaId))
}

export async function entrarComoAdmin(): Promise<void> {
  await getConnection().invoke('EntrarComoAdmin')
}

export async function enviarMensagem(
  conversaId: number,
  conteudo: string,
  remetenteTipo: 'cliente' | 'admin',
  remetenteNome: string
): Promise<boolean> {
  return getConnection().invoke('EnviarMensagem', conversaId, conteudo, remetenteTipo, remetenteNome)
}

// ─── REST API ────────────────────────────────────────────────────────────────
export async function criarConversa(nomeCliente: string, clienteId?: number): Promise<Conversa> {
  const { data } = await api.post<Conversa>('/chat/conversas', { nomeCliente, clienteId })
  return data
}

export async function getConversas(): Promise<Conversa[]> {
  const { data } = await api.get<Conversa[]>('/chat/conversas')
  return data
}

export async function getMensagens(conversaId: number): Promise<Mensagem[]> {
  const { data } = await api.get<Mensagem[]>(`/chat/conversas/${conversaId}/mensagens`)
  return data
}

export async function fecharConversa(conversaId: number): Promise<void> {
  await api.put(`/chat/conversas/${conversaId}/fechar`)
}
