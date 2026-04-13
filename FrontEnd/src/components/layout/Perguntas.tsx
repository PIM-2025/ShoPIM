import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Trash2, MessageCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  getPerguntas,
  fazerPergunta,
  responderPergunta,
  deletarPergunta,
} from '@/service/perguntaService'

/* ── Formulário de resposta (admin) ──────────────────────────── */
function FormResposta({
  idPergunta,
  idProduto,
  onClose,
}: {
  idPergunta: number
  idProduto: number
  onClose: () => void
}) {
  const [texto, setTexto] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => responderPergunta(idPergunta, texto),
    onSuccess: () => {
      toast.success('Resposta enviada!')
      queryClient.invalidateQueries({ queryKey: ['perguntas', idProduto] })
      onClose()
    },
    onError: () => toast.error('Erro ao enviar resposta.'),
  })

  return (
    <div className='mt-2 space-y-2'>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder='Digite a resposta...'
        maxLength={2000}
        rows={2}
        className='w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary'
      />
      <div className='flex gap-2'>
        <button
          disabled={!texto.trim() || isPending}
          onClick={() => mutate()}
          className='flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
        >
          {isPending && <Loader2 size={12} className='animate-spin' />}
          Responder
        </button>
        <button
          onClick={onClose}
          className='rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground'
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

/* ── Componente principal ──────────────────────────────────────── */
export function Perguntas({ idProduto }: { idProduto: number }) {
  const { auth } = useAuthStore()
  const user = auth.user
  const isAdmin = user?.role.includes('admin')
  const queryClient = useQueryClient()

  const [novaPergunta, setNovaPergunta] = useState('')
  const [respondendoId, setRespondendoId] = useState<number | null>(null)

  const { data: perguntas = [], isLoading } = useQuery({
    queryKey: ['perguntas', idProduto],
    queryFn: () => getPerguntas(idProduto),
  })

  const { mutate: enviarPergunta, isPending: enviando } = useMutation({
    mutationFn: () => fazerPergunta({ idProduto, texto: novaPergunta }),
    onSuccess: () => {
      toast.success('Pergunta enviada!')
      setNovaPergunta('')
      queryClient.invalidateQueries({ queryKey: ['perguntas', idProduto] })
    },
    onError: () => toast.error('Erro ao enviar pergunta.'),
  })

  const { mutate: deletar } = useMutation({
    mutationFn: deletarPergunta,
    onSuccess: () => {
      toast.success('Pergunta removida.')
      queryClient.invalidateQueries({ queryKey: ['perguntas', idProduto] })
    },
  })

  return (
    <div className='space-y-6'>
      {/* Formulário de pergunta */}
      {user ? (
        <div className='space-y-3 rounded-xl border border-border bg-muted/30 p-4'>
          <p className='text-sm font-medium'>Faça uma pergunta</p>
          <textarea
            value={novaPergunta}
            onChange={(e) => setNovaPergunta(e.target.value)}
            placeholder='Tem alguma dúvida sobre o produto?'
            maxLength={2000}
            rows={3}
            className='w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary'
          />
          <button
            disabled={!novaPergunta.trim() || enviando}
            onClick={() => enviarPergunta()}
            className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
          >
            {enviando && <Loader2 size={14} className='animate-spin' />}
            Enviar pergunta
          </button>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          <a href='/sign-in' className='underline hover:text-foreground'>
            Faça login
          </a>{' '}
          para fazer uma pergunta.
        </p>
      )}

      {/* Lista de perguntas */}
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Loader2 size={24} className='animate-spin text-muted-foreground' />
        </div>
      ) : perguntas.length === 0 ? (
        <div className='flex flex-col items-center gap-2 py-10 text-muted-foreground'>
          <MessageCircle size={32} className='opacity-30' />
          <p className='text-sm'>Nenhuma pergunta ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {perguntas.map((p) => (
            <div key={p.id} className='rounded-xl border border-border p-4 space-y-3'>
              {/* Pergunta */}
              <div className='flex gap-3'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground'>
                  {p.nomeUsuario.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm font-medium'>{p.nomeUsuario}</span>
                      <span className='text-xs text-muted-foreground'>
                        {format(new Date(p.criadoEm), "d MMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {(isAdmin || user?.id === p.idUser) && (
                      <button
                        onClick={() => deletar(p.id)}
                        className='text-muted-foreground hover:text-destructive'
                        title='Remover pergunta'
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className='mt-1 text-sm'>{p.texto}</p>
                </div>
              </div>

              {/* Resposta */}
              {p.resposta ? (
                <div className='ml-11 flex gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-950/30'>
                  <CheckCircle2 size={15} className='mt-0.5 shrink-0 text-green-600 dark:text-green-400' />
                  <div>
                    <p className='text-xs font-medium text-green-700 dark:text-green-400'>
                      Resposta do vendedor
                      {p.respondidoEm && (
                        <span className='ml-1.5 font-normal text-muted-foreground'>
                          · {format(new Date(p.respondidoEm), "d MMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </p>
                    <p className='mt-0.5 text-sm text-foreground'>{p.resposta}</p>
                  </div>
                </div>
              ) : isAdmin ? (
                respondendoId === p.id ? (
                  <div className='ml-11'>
                    <FormResposta
                      idPergunta={p.id}
                      idProduto={idProduto}
                      onClose={() => setRespondendoId(null)}
                    />
                  </div>
                ) : (
                  <div className='ml-11'>
                    <button
                      onClick={() => setRespondendoId(p.id)}
                      className='text-xs font-medium text-primary hover:underline'
                    >
                      Responder
                    </button>
                  </div>
                )
              ) : (
                <div className='ml-11'>
                  <p className='text-xs text-muted-foreground italic'>Aguardando resposta do vendedor...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
