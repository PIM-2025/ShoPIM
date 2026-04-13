import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Star, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  getAvaliacoes,
  criarAvaliacao,
  deletarAvaliacao,
} from '@/service/avaliacaoService'

/* ── Estrelas ──────────────────────────────────────────────────── */
function Estrelas({
  nota,
  interativo = false,
  onChange,
}: {
  nota: number
  interativo?: boolean
  onChange?: (n: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={interativo ? 22 : 16}
          className={`transition ${
            n <= (hover || nota)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-transparent text-muted-foreground'
          } ${interativo ? 'cursor-pointer' : ''}`}
          onMouseEnter={() => interativo && setHover(n)}
          onMouseLeave={() => interativo && setHover(0)}
          onClick={() => interativo && onChange?.(n)}
        />
      ))}
    </div>
  )
}

/* ── Formulário ────────────────────────────────────────────────── */
function FormAvaliacao({ idProduto }: { idProduto: number }) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => criarAvaliacao({ idProduto, nota, comentario }),
    onSuccess: () => {
      toast.success('Avaliação enviada!')
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', idProduto] })
    },
    onError: () => toast.error('Erro ao enviar avaliação.'),
  })

  return (
    <div className='space-y-3 rounded-xl border border-border bg-muted/30 p-4'>
      <p className='text-sm font-medium'>Sua avaliação</p>

      <div className='flex items-center gap-2'>
        <Estrelas nota={nota} interativo onChange={setNota} />
        {nota > 0 && (
          <span className='text-xs text-muted-foreground'>
            {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][nota]}
          </span>
        )}
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder='Deixe um comentário (opcional)'
        maxLength={1000}
        rows={3}
        className='w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary'
      />

      <button
        disabled={nota === 0 || isPending}
        onClick={() => mutate()}
        className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
      >
        {isPending && <Loader2 size={14} className='animate-spin' />}
        Enviar avaliação
      </button>
    </div>
  )
}

/* ── Componente principal ──────────────────────────────────────── */
export function Avaliacoes({ idProduto }: { idProduto: number }) {
  const { auth } = useAuthStore()
  const user = auth.user
  const isAdmin = user?.role.includes('admin')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['avaliacoes', idProduto],
    queryFn: () => getAvaliacoes(idProduto),
  })

  const { mutate: deletar } = useMutation({
    mutationFn: deletarAvaliacao,
    onSuccess: () => {
      toast.success('Avaliação removida.')
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', idProduto] })
    },
  })

  return (
    <div className='space-y-6'>
      {/* Resumo */}
      {!isLoading && data && data.total > 0 && (
        <div className='flex items-center gap-3'>
          <span className='text-4xl font-bold'>{data.media.toFixed(1)}</span>
          <div className='space-y-1'>
            <Estrelas nota={Math.round(data.media)} />
            <p className='text-xs text-muted-foreground'>
              {data.total} {data.total === 1 ? 'avaliação' : 'avaliações'}
            </p>
          </div>
        </div>
      )}

      {/* Formulário / mensagens */}
      {!isLoading && (
        <>
          {user && data?.podeAvaliar && <FormAvaliacao idProduto={idProduto} />}
          {user && data?.jaAvaliou && (
            <p className='text-sm text-muted-foreground'>
              Você já avaliou este produto.
            </p>
          )}
          {user && !data?.podeAvaliar && !data?.jaAvaliou && (
            <p className='text-sm text-muted-foreground'>
              Apenas clientes que concluíram a compra deste produto podem avaliá-lo.
            </p>
          )}
          {!user && (
            <p className='text-sm text-muted-foreground'>
              <a href='/sign-in' className='underline hover:text-foreground'>
                Faça login
              </a>{' '}
              e compre o produto para poder avaliá-lo.
            </p>
          )}
        </>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Loader2 size={24} className='animate-spin text-muted-foreground' />
        </div>
      ) : data?.avaliacoes.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          Nenhuma avaliação ainda. Seja o primeiro!
        </p>
      ) : (
        <div className='space-y-4'>
          {data?.avaliacoes.map((a) => (
            <div
              key={a.id}
              className='flex gap-3 rounded-xl border border-border p-4'
            >
              {/* Avatar */}
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
                {a.nomeUsuario.charAt(0).toUpperCase()}
              </div>

              <div className='flex-1 space-y-1'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>{a.nomeUsuario}</span>
                    <Estrelas nota={a.nota} />
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>
                      {format(new Date(a.criadoEm), "d MMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                    {(isAdmin || user?.id === a.idUser) && (
                      <button
                        onClick={() => deletar(a.id)}
                        className='text-muted-foreground hover:text-destructive'
                        title='Remover avaliação'
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {a.comentario && (
                  <p className='text-sm text-muted-foreground'>{a.comentario}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
