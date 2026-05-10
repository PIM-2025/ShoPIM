import { useEffect, useRef, useState } from 'react'
import {
  criarConversa,
  entrarConversa,
  enviarMensagem,
  getMensagens,
  getConnection,
  startConnection,
  type Mensagem,
} from '@/service/chatService'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORAGE_KEY = 'shopim_conversa_id'

// Mensagem virtual de sistema (id negativo fixo para não colidir com reais)
const MSG_ENCERRADA: Mensagem = {
  id: -999999,
  conversaId: 0,
  conteudo: '— Atendimento encerrado pelo suporte —',
  remetenteTipo: 'admin',
  remetenteNome: 'Sistema',
  enviadoEm: new Date().toISOString(),
}

export function ChatWidget() {
  const { auth } = useAuthStore()
  const usuario = auth.user

  const [isOpen, setIsOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [conversaId, setConversaId] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : null
  })
  const [botAtivo, setBotAtivo] = useState<boolean>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_bot`)
    return stored !== 'false'
  })
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [inputNome, setInputNome] = useState('')
  const [inputMsg, setInputMsg] = useState('')
  const [nomeCliente, setNomeCliente] = useState<string>(usuario?.name ?? '')
  const [iniciado, setIniciado] = useState(false)
  const [encerrada, setEncerrada] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // Registra handlers SignalR uma única vez por montagem
  useEffect(() => {
    const conn = getConnection()

    const onMensagem = (msg: Mensagem) => {
      // Se um admin humano mandar mensagem, desativa o bot automaticamente
      if (
        msg.remetenteTipo === 'admin' &&
        msg.remetenteNome !== 'Assistente Virtual' &&
        msg.remetenteNome !== 'Sistema'
      ) {
        setBotAtivo(false)
        localStorage.setItem(`${STORAGE_KEY}_bot`, 'false')
      }

      setMensagens((prev) => {
        const semTemp = prev.filter(
          (m) =>
            !(
              m.id < 0 &&
              m.id !== -999999 &&
              m.conteudo === msg.conteudo &&
              m.remetenteTipo === msg.remetenteTipo
            )
        )
        if (semTemp.some((m) => m.id === msg.id)) return semTemp
        return [...semTemp, msg]
      })
    }

    const onFechada = () => {
      // Adiciona mensagem de sistema e marca como encerrada
      setMensagens((prev) => {
        if (prev.some((m) => m.id === MSG_ENCERRADA.id)) return prev
        return [
          ...prev,
          { ...MSG_ENCERRADA, enviadoEm: new Date().toISOString() },
        ]
      })
      setEncerrada(true)
      // Remove do storage para que novo envio crie nova conversa
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(`${STORAGE_KEY}_bot`)
      setBotAtivo(true)
    }

    const onDesativarBot = () => {
      setBotAtivo(false)
      localStorage.setItem(`${STORAGE_KEY}_bot`, 'false')
    }

    conn.off('ReceberMensagem')
    conn.off('ConversaFechada')
    conn.off('DesativarBot')
    conn.on('ReceberMensagem', onMensagem)
    conn.on('ConversaFechada', onFechada)
    conn.on('DesativarBot', onDesativarBot)

    return () => {
      conn.off('ReceberMensagem', onMensagem)
      conn.off('ConversaFechada', onFechada)
      conn.off('DesativarBot', onDesativarBot)
    }
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
        // Se a conversa falhar ao carregar (ex: foi apagada no banco), limpa o cache local
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(`${STORAGE_KEY}_bot`)
        setConversaId(null)
        setMensagens([])
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

  // Função que envia o histórico para a API do Groq e responde como Bot
  const handleBotResponse = async (
    idConversa: number,
    textoUsuario: string
  ) => {
    if (!botAtivo) return

    try {
      const conn = getConnection()
      await conn.invoke('PedirRespostaBot', idConversa, textoUsuario)
    } catch (e) {
      console.error('Chat: erro ao solicitar resposta ao bot', e)
    }
  }

  // Inicia conversa (primeira mensagem ou reabertura após encerramento)
  const handleIniciar = async () => {
    const nome = usuario?.name ?? inputNome.trim()
    const texto = inputMsg.trim()
    if (!nome || !texto) return

    const tempId = -Date.now()
    const tempMsg: Mensagem = {
      id: tempId,
      conversaId: 0,
      conteudo: texto,
      remetenteTipo: 'cliente',
      remetenteNome: nome,
      enviadoEm: new Date().toISOString(),
    }

    if (encerrada) {
      // Mantém histórico anterior + mensagem de reabertura
      setMensagens((prev) => [...prev, tempMsg])
    } else {
      setMensagens([tempMsg])
    }
    setInputMsg('')
    setConnecting(true)

    try {
      await startConnection()
      const conversa = await criarConversa(nome, usuario?.id)
      localStorage.setItem(STORAGE_KEY, String(conversa.id))
      localStorage.setItem(`${STORAGE_KEY}_bot`, 'true')
      setConversaId(conversa.id)
      setNomeCliente(nome)
      setEncerrada(false)
      setIniciado(true)
      setBotAtivo(true)
      await entrarConversa(conversa.id)
      await enviarMensagem(conversa.id, texto, 'cliente', nome)
      await handleBotResponse(conversa.id, texto)
    } catch (e) {
      console.error('Chat: erro ao iniciar', e)
      setMensagens((prev) => prev.filter((m) => m.id !== tempId))
    } finally {
      setConnecting(false)
    }
  }

  const resetConversaInvalida = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(`${STORAGE_KEY}_bot`)
    setConversaId(null)
    setIniciado(false)
    setEncerrada(false)
    setBotAtivo(true)
    setMensagens([])
  }

  // Envia mensagem numa conversa existente
  const handleEnviar = async () => {
    const texto = inputMsg.trim()
    if (!texto || !conversaId) return

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
      const enviada = await enviarMensagem(
        conversaId,
        texto,
        'cliente',
        nomeCliente || 'Cliente'
      )
      if (!enviada) {
        setMensagens((prev) => prev.filter((m) => m.id !== tempId))
        resetConversaInvalida()
        return
      }
      await handleBotResponse(conversaId, texto)
    } catch (e) {
      console.error('Chat: erro ao enviar', e)
      setMensagens((prev) => prev.filter((m) => m.id !== tempId))
      if (e instanceof Error && e.message.includes('CONVERSA_NAO_ENCONTRADA')) {
        resetConversaInvalida()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (encerrada || !conversaId) {
        handleIniciar()
      } else {
        handleEnviar()
      }
    }
  }

  const handleSubmit = () => {
    if (encerrada || !conversaId) {
      handleIniciar()
    } else {
      handleEnviar()
    }
  }

  const precisaNome = (!usuario || !usuario.name) && !conversaId && !encerrada

  return (
    <div className='fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3'>
      {isOpen && (
        <div className='flex h-[420px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl'>
          {/* Header */}
          <div className='flex items-center justify-between bg-primary px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-primary-foreground'>
                Suporte ShoPIM
              </p>
              <p className='text-xs text-primary-foreground/70'>
                {connecting
                  ? 'Conectando...'
                  : encerrada
                    ? 'Encerrado'
                    : 'Online'}
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
                <Loader2
                  size={20}
                  className='animate-spin text-muted-foreground'
                />
              </div>
            )}
            {mensagens.map((msg) => {
              // Mensagem de sistema (encerramento)
              if (msg.id === -999999 || msg.remetenteNome === 'Sistema') {
                return (
                  <p
                    key={msg.id}
                    className='py-1 text-center text-[11px] text-muted-foreground italic'
                  >
                    {msg.conteudo}
                  </p>
                )
              }
              return (
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
              )
            })}
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
                placeholder={
                  encerrada
                    ? 'Digite para iniciar novo atendimento...'
                    : 'Digite sua mensagem...'
                }
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                className='h-8 text-sm'
                disabled={connecting || (precisaNome && !inputNome.trim())}
              />
              <Button
                size='icon'
                className='h-8 w-8 shrink-0'
                disabled={
                  connecting ||
                  !inputMsg.trim() ||
                  (precisaNome && !inputNome.trim())
                }
                onClick={handleSubmit}
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
