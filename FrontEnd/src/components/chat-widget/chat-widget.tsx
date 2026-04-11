import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'
import {
  criarConversa,
  entrarConversa,
  enviarMensagem,
  getMensagens,
  getConnection,
  startConnection,
  type Mensagem,
} from '@/service/chatService'

const STORAGE_KEY = 'shopim_conversa_id'

export function ChatWidget() {
  const { auth } = useAuthStore()
  const usuario = auth.user

  const [isOpen, setIsOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [conversaId, setConversaId] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : null
  })
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [inputNome, setInputNome] = useState('')
  const [inputMsg, setInputMsg] = useState('')
  const [nomeCliente, setNomeCliente] = useState<string>(usuario?.name ?? '')
  const [iniciado, setIniciado] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // Registra handler SignalR uma única vez por montagem
  useEffect(() => {
    const conn = getConnection()
    const handler = (msg: Mensagem) => {
      setMensagens((prev) => {
        // Remove temp otimista com mesmo conteúdo/remetente, se existir
        const semTemp = prev.filter(
          (m) => !(m.id < 0 && m.conteudo === msg.conteudo && m.remetenteTipo === msg.remetenteTipo)
        )
        // Evita duplicata (ID já presente)
        if (semTemp.some((m) => m.id === msg.id)) return semTemp
        return [...semTemp, msg]
      })
    }
    conn.off('ReceberMensagem')
    conn.on('ReceberMensagem', handler)
    return () => { conn.off('ReceberMensagem', handler) }
  }, [])

  // Carrega histórico e conecta ao abrir, se já tiver uma conversa
  useEffect(() => {
    if (!isOpen || !conversaId || iniciado) return

    const init = async () => {
      setConnecting(true)
      try {
        await startConnection()
        await entrarConversa(conversaId)
        const historico = await getMensagens(conversaId)
        setMensagens(historico)
        setIniciado(true)
      } catch (e) {
        console.error('Chat: erro ao conectar', e)
      } finally {
        setConnecting(false)
      }
    }
    init()
  }, [isOpen, conversaId, iniciado])

  // Scroll automático para última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Inicia conversa (primeira mensagem)
  const handleIniciar = async () => {
    const nome = usuario?.name ?? inputNome.trim()
    const texto = inputMsg.trim()
    console.log('[ChatWidget] handleIniciar', { nome, texto, usuario, conversaId, connecting, precisaNome })
    if (!nome || !texto) return

    // Otimista: mostra a mensagem imediatamente
    const tempId = -Date.now()
    const tempMsg: Mensagem = {
      id: tempId,
      conversaId: 0,
      conteudo: texto,
      remetenteTipo: 'cliente',
      remetenteNome: nome,
      enviadoEm: new Date().toISOString(),
    }
    setMensagens([tempMsg])
    setInputMsg('')
    setConnecting(true)
    try {
      await startConnection()

      const conversa = await criarConversa(nome, usuario?.id)
      localStorage.setItem(STORAGE_KEY, String(conversa.id))
      setConversaId(conversa.id)
      setNomeCliente(nome)

      await entrarConversa(conversa.id)
      await enviarMensagem(conversa.id, texto, 'cliente', nome)
      setIniciado(true)
    } catch (e) {
      console.error('Chat: erro ao iniciar', e)
      // Reverte otimista em caso de erro
      setMensagens((prev) => prev.filter((m) => m.id !== tempId))
    } finally {
      setConnecting(false)
    }
  }

  // Envia mensagem numa conversa existente
  const handleEnviar = async () => {
    const texto = inputMsg.trim()
    console.log('[ChatWidget] handleEnviar', { texto, conversaId, connecting })
    if (!texto || !conversaId) return

    // Otimista: mostra a mensagem imediatamente
    const tempId = -Date.now()
    const tempMsg: Mensagem = {
      id: tempId,
      conversaId,
      conteudo: texto,
      remetenteTipo: 'cliente',
      remetenteNome: nomeCliente || 'Cliente',
      enviadoEm: new Date().toISOString(),
    }
    setMensagens((prev) => [...prev, tempMsg])
    setInputMsg('')
    try {
      await enviarMensagem(conversaId, texto, 'cliente', nomeCliente || 'Cliente')
    } catch (e) {
      console.error('Chat: erro ao enviar', e)
      setMensagens((prev) => prev.filter((m) => m.id !== tempId))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      conversaId ? handleEnviar() : handleIniciar()
    }
  }

  const precisaNome = (!usuario || !usuario.name) && !conversaId

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
      {/* Janela do chat */}
      {isOpen && (
        <div className='flex h-[420px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl'>
          {/* Header */}
          <div className='flex items-center justify-between bg-primary px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-primary-foreground'>Suporte ShoPIM</p>
              <p className='text-xs text-primary-foreground/70'>
                {connecting ? 'Conectando...' : 'Online'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='rounded-full p-1 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10'
            >
              <X size={16} />
            </button>
          </div>

          {/* Mensagens */}
          <div className='flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3'>
            {mensagens.length === 0 && !connecting && (
              <p className='text-center text-xs text-muted-foreground'>
                {conversaId
                  ? 'Sem mensagens ainda.'
                  : 'Envie uma mensagem para iniciar o atendimento.'}
              </p>
            )}
            {connecting && (
              <div className='flex flex-1 items-center justify-center'>
                <Loader2 size={20} className='animate-spin text-muted-foreground' />
              </div>
            )}
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                  msg.remetenteTipo === 'cliente'
                    ? 'self-end rounded-br-none bg-primary text-primary-foreground'
                    : 'self-start rounded-bl-none bg-muted'
                )}
              >
                {msg.remetenteTipo === 'admin' && (
                  <p className='mb-0.5 text-[10px] font-medium text-muted-foreground'>
                    {msg.remetenteNome}
                  </p>
                )}
                <p>{msg.conteudo}</p>
                <p
                  className={cn(
                    'mt-0.5 text-right text-[10px]',
                    msg.remetenteTipo === 'cliente'
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground'
                  )}
                >
                  {new Date(msg.enviadoEm).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className='border-t px-3 py-2'>
            {precisaNome && (
              <Input
                placeholder='Seu nome'
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                className='mb-2 h-8 text-sm'
                disabled={connecting}
              />
            )}
            <div className='flex gap-2'>
              <Input
                placeholder='Digite sua mensagem...'
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                className='h-8 text-sm'
                disabled={connecting || (precisaNome && !inputNome.trim())}
              />
              <Button
                size='icon'
                className='h-8 w-8 shrink-0'
                disabled={connecting || !inputMsg.trim() || (precisaNome && !inputNome.trim())}
                onClick={conversaId ? handleEnviar : handleIniciar}
              >
                {connecting ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <Send size={14} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className='flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95'
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
