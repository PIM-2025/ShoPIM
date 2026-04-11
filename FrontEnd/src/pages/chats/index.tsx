import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Loader2,
  MessagesSquare,
  MoreVertical,
  Search as SearchIcon,
  Send,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuthStore } from '@/stores/auth-store'
import {
  entrarComoAdmin,
  entrarConversa,
  enviarMensagem,
  fecharConversa,
  getConnection,
  getConversas,
  getMensagens,
  startConnection,
  type Conversa,
  type Mensagem,
} from '@/service/chatService'

export function Chats() {
  const { auth } = useAuthStore()
  const adminNome = auth.user?.name ?? 'Admin'

  const [search, setSearch] = useState('')
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [selected, setSelected] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [inputMsg, setInputMsg] = useState('')
  const [loadingConversas, setLoadingConversas] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // Conecta ao hub como admin e carrega lista de conversas
  useEffect(() => {
    const conn = getConnection()

    const onReceberMensagem = (msg: Mensagem) => {
      setMensagens((prev) =>
        prev[0]?.conversaId === msg.conversaId || selected?.id === msg.conversaId
          ? [...prev, msg]
          : prev
      )
      setConversas((prev) =>
        prev.map((c) =>
          c.id === msg.conversaId
            ? {
                ...c,
                ultimaMensagem: {
                  conteudo: msg.conteudo,
                  remetenteTipo: msg.remetenteTipo,
                  enviadoEm: msg.enviadoEm,
                },
              }
            : c
        )
      )
    }

    const onConversaAtualizada = () => {
      getConversas().then(setConversas).catch(console.error)
    }

    conn.off('ReceberMensagem', onReceberMensagem)
    conn.off('ConversaAtualizada', onConversaAtualizada)
    conn.on('ReceberMensagem', onReceberMensagem)
    conn.on('ConversaAtualizada', onConversaAtualizada)

    const init = async () => {
      try {
        await startConnection()
        await entrarComoAdmin()
        const lista = await getConversas()
        setConversas(lista)
      } catch (e) {
        console.error('Chats admin: erro ao conectar', e)
      } finally {
        setLoadingConversas(false)
      }
    }
    init()

    return () => {
      conn.off('ReceberMensagem', onReceberMensagem)
      conn.off('ConversaAtualizada', onConversaAtualizada)
    }
  }, [])

  // Ao selecionar conversa: entra na sala e carrega histórico
  const handleSelectConversa = async (conversa: Conversa) => {
    if (selected?.id === conversa.id) return
    setSelected(conversa)
    setMobileOpen(true)
    setLoadingMsgs(true)
    try {
      await entrarConversa(conversa.id)
      const hist = await getMensagens(conversa.id)
      setMensagens(hist)
    } catch (e) {
      console.error('Erro ao carregar mensagens', e)
    } finally {
      setLoadingMsgs(false)
    }
  }

  // Envia mensagem como admin
  const handleEnviar = async () => {
    const texto = inputMsg.trim()
    if (!texto || !selected) return
    setInputMsg('')
    await enviarMensagem(selected.id, texto, 'admin', adminNome)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const handleFechar = async () => {
    if (!selected) return
    await fecharConversa(selected.id)
    setConversas((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, status: 'fechada' } : c))
    )
    setSelected((c) => (c ? { ...c, status: 'fechada' } : c))
  }

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const filtradas = conversas.filter((c) =>
    c.nomeCliente.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* ── Lista de conversas ── */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center gap-2 py-2'>
                <h1 className='text-2xl font-bold'>Suporte</h1>
                <MessagesSquare size={20} />
              </div>
              <label className={cn(
                'flex h-10 w-full items-center space-x-0 rounded-md border border-border ps-2',
                'focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden'
              )}>
                <SearchIcon size={15} className='me-2 stroke-slate-500' />
                <span className='sr-only'>Buscar</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
                  placeholder='Buscar conversa...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full overflow-scroll p-3'>
              {loadingConversas ? (
                <div className='flex justify-center py-8'>
                  <Loader2 size={20} className='animate-spin text-muted-foreground' />
                </div>
              ) : filtradas.length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  Nenhuma conversa ainda.
                </p>
              ) : (
                filtradas.map((conversa) => (
                  <div key={conversa.id}>
                    <button
                      type='button'
                      className={cn(
                        'group flex w-full rounded-md px-2 py-2 text-start text-sm',
                        'hover:bg-accent hover:text-accent-foreground',
                        selected?.id === conversa.id && 'sm:bg-muted'
                      )}
                      onClick={() => handleSelectConversa(conversa)}
                    >
                      <div className='flex w-full gap-2'>
                        <Avatar className='shrink-0'>
                          <AvatarFallback>
                            {conversa.nomeCliente.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between gap-1'>
                            <span className='truncate font-medium'>{conversa.nomeCliente}</span>
                            <Badge
                              variant='outline'
                              className={cn(
                                'shrink-0 text-[10px]',
                                conversa.status === 'aberta'
                                  ? 'border-teal-300 bg-teal-100/30 text-teal-800 dark:text-teal-200'
                                  : 'border-neutral-300 bg-neutral-100/30 text-muted-foreground'
                              )}
                            >
                              {conversa.status}
                            </Badge>
                          </div>
                          {conversa.ultimaMensagem && (
                            <span className='line-clamp-1 text-xs text-muted-foreground group-hover:text-accent-foreground/90'>
                              {conversa.ultimaMensagem.remetenteTipo === 'admin' ? 'Você: ' : ''}
                              {conversa.ultimaMensagem.conteudo}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* ── Painel de mensagens ── */}
          {selected ? (
            <div className={cn(
              'absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
              mobileOpen && 'start-0 flex'
            )}>
              {/* Header da conversa */}
              <div className='mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md'>
                <div className='flex items-center gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ms-2 h-full sm:hidden'
                    onClick={() => setMobileOpen(false)}
                  >
                    <ArrowLeft className='rtl:rotate-180' />
                  </Button>
                  <Avatar className='size-9'>
                    <AvatarFallback>
                      {selected.nomeCliente.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-medium'>{selected.nomeCliente}</p>
                    <p className='text-xs text-muted-foreground'>
                      Iniciado em{' '}
                      {format(new Date(selected.criadoEm), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  {selected.status === 'aberta' && (
                    <Button variant='outline' size='sm' onClick={handleFechar}>
                      <X size={14} className='me-1' />
                      Encerrar
                    </Button>
                  )}
                  <Button size='icon' variant='ghost' className='h-8 w-6'>
                    <MoreVertical className='stroke-muted-foreground' size={18} />
                  </Button>
                </div>
              </div>

              {/* Mensagens */}
              <div className='flex flex-1 flex-col gap-2 overflow-hidden px-4 pt-0 pb-4'>
                <div className='relative flex size-full flex-1'>
                  <div className='relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div className='flex h-40 w-full grow flex-col justify-end gap-3 overflow-y-auto py-2 pe-4 pb-4'>
                      {loadingMsgs ? (
                        <div className='flex flex-1 items-center justify-center'>
                          <Loader2 size={20} className='animate-spin text-muted-foreground' />
                        </div>
                      ) : mensagens.length === 0 ? (
                        <p className='text-center text-sm text-muted-foreground'>
                          Nenhuma mensagem ainda.
                        </p>
                      ) : (
                        mensagens.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'chat-box max-w-72 px-3 py-2 shadow-lg wrap-break-word',
                              msg.remetenteTipo === 'admin'
                                ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/90'
                                : 'self-start rounded-[16px_16px_16px_0] bg-muted'
                            )}
                          >
                            {msg.conteudo}
                            <span className={cn(
                              'mt-1 block text-xs font-light italic',
                              msg.remetenteTipo === 'admin'
                                ? 'text-end text-primary-foreground/70'
                                : 'text-foreground/60'
                            )}>
                              {format(new Date(msg.enviadoEm), 'HH:mm')}
                            </span>
                          </div>
                        ))
                      )}
                      <div ref={bottomRef} />
                    </div>
                  </div>
                </div>

                {/* Input */}
                <form
                  className='flex w-full flex-none gap-2'
                  onSubmit={(e) => { e.preventDefault(); handleEnviar() }}
                >
                  <div className='flex flex-1 items-center gap-2 rounded-md border border-input bg-card px-3 py-1 focus-within:ring-1 focus-within:ring-ring'>
                    <input
                      type='text'
                      placeholder={
                        selected.status === 'fechada'
                          ? 'Conversa encerrada'
                          : 'Digite sua resposta...'
                      }
                      disabled={selected.status === 'fechada'}
                      className='h-8 w-full bg-inherit text-sm focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      type='submit'
                      variant='ghost'
                      size='icon'
                      disabled={!inputMsg.trim() || selected.status === 'fechada'}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className='absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-card shadow-xs sm:static sm:z-auto sm:flex'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='flex size-16 items-center justify-center rounded-full border-2 border-border'>
                  <MessagesSquare className='size-8' />
                </div>
                <div className='space-y-1 text-center'>
                  <h1 className='text-xl font-semibold'>Suporte ao Cliente</h1>
                  <p className='text-sm text-muted-foreground'>
                    Selecione uma conversa para responder.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </Main>
    </>
  )
}
