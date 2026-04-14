import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, X, Loader2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { getAvaliacoesPendentes, criarAvaliacao, ProdutoPendente } from '@/service/avaliacaoService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const SESSION_KEY = 'avaliacao_popup_dispensado'
const NOTA_LABEL = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']

/* ── Formulário de uma avaliação ─────────────────────────────────── */
function FormItem({
  produto,
  onAvaliado,
}: {
  produto: ProdutoPendente
  onAvaliado: () => void
}) {
  const [nota, setNota] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviado, setEnviado] = useState(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => criarAvaliacao({ idProduto: produto.id, nota, comentario }),
    onSuccess: () => {
      toast.success(`Avaliação de "${produto.descricao}" enviada!`)
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', produto.id] })
      queryClient.invalidateQueries({ queryKey: ['avaliacoes-pendentes'] })
      setEnviado(true)
      onAvaliado()
    },
    onError: () => toast.error('Erro ao enviar avaliação.'),
  })

  if (enviado) {
    return (
      <div className='flex items-center gap-2 py-2 text-sm text-green-600 dark:text-green-400'>
        <Star size={14} className='fill-yellow-400 text-yellow-400' />
        Avaliado — obrigado!
      </div>
    )
  }

  return (
    <div className='space-y-3 rounded-xl border border-border bg-muted/20 p-4'>
      {/* Produto */}
      <div className='flex items-center gap-3'>
        {produto.imagem && (
          <img
            src={produto.imagem}
            alt={produto.descricao}
            className='h-12 w-12 shrink-0 rounded-lg object-cover'
          />
        )}
        <p className='text-sm font-medium leading-snug'>{produto.descricao}</p>
      </div>

      {/* Estrelas */}
      <div className='flex items-center gap-2'>
        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={24}
              className={cn(
                'cursor-pointer transition',
                n <= (hover || nota)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-muted-foreground'
              )}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setNota(n)}
            />
          ))}
        </div>
        {nota > 0 && (
          <span className='text-xs text-muted-foreground'>{NOTA_LABEL[nota]}</span>
        )}
      </div>

      {/* Comentário */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder='Comentário opcional'
        maxLength={1000}
        rows={2}
        className='w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary'
      />

      <Button
        disabled={nota === 0 || isPending}
        onClick={() => mutate()}
        size='sm'
        className='w-full'
      >
        {isPending && <Loader2 size={13} className='mr-2 animate-spin' />}
        Enviar avaliação
      </Button>
    </div>
  )
}

/* ── Dialog com todos os pendentes ──────────────────────────────── */
function DialogPendentes({
  open,
  onClose,
  pendentes,
}: {
  open: boolean
  onClose: () => void
  pendentes: ProdutoPendente[]
}) {
  const [avaliados, setAvaliados] = useState<Set<number>>(new Set())

  const marcar = (id: number) => setAvaliados((prev) => new Set([...prev, id]))
  const restantes = pendentes.filter((p) => !avaliados.has(p.id))

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Star size={18} className='fill-yellow-400 text-yellow-400' />
            Avalie seus produtos
          </DialogTitle>
        </DialogHeader>

        {restantes.length === 0 ? (
          <div className='py-6 text-center'>
            <p className='text-sm font-medium text-green-600 dark:text-green-400'>
              Tudo avaliado, obrigado!
            </p>
            <Button variant='outline' size='sm' className='mt-4' onClick={onClose}>
              Fechar
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Você tem{' '}
              <span className='font-semibold text-foreground'>{restantes.length}</span>{' '}
              {restantes.length === 1 ? 'produto pendente' : 'produtos pendentes'} de avaliação.
            </p>
            {restantes.map((produto) => (
              <FormItem
                key={produto.id}
                produto={produto}
                onAvaliado={() => marcar(produto.id)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ── Popup flutuante ─────────────────────────────────────────────── */
export function AvaliacaoPendentePopup() {
  const { auth } = useAuthStore()
  const user = auth.user
  const isAdmin = user?.role?.includes('admin')

  const [dispensado, setDispensado] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: pendentes = [] } = useQuery({
    queryKey: ['avaliacoes-pendentes'],
    queryFn: getAvaliacoesPendentes,
    enabled: !!user && !isAdmin && !dispensado,
    staleTime: 60_000,
  })

  const dispensar = () => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setDispensado(true)
  }

  if (!user || isAdmin || dispensado || pendentes.length === 0) return null

  return (
    <>
      {/* Card flutuante */}
      <div className='fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-yellow-300 bg-background shadow-xl dark:border-yellow-700'>
        {/* Cabeçalho */}
        <div className='flex items-center justify-between rounded-t-2xl bg-yellow-400/20 px-4 py-3 dark:bg-yellow-900/30'>
          <div className='flex items-center gap-2'>
            <Star size={16} className='fill-yellow-500 text-yellow-500' />
            <span className='text-sm font-semibold'>Avalie sua compra</span>
          </div>
          <button
            onClick={dispensar}
            className='rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground'
            aria-label='Dispensar'
          >
            <X size={14} />
          </button>
        </div>

        {/* Prévia dos produtos */}
        <div className='px-4 py-3'>
          <p className='mb-3 text-xs text-muted-foreground'>
            Você tem{' '}
            <span className='font-semibold text-foreground'>
              {pendentes.length} {pendentes.length === 1 ? 'produto' : 'produtos'}
            </span>{' '}
            esperando sua avaliação.
          </p>

          {/* Miniaturas */}
          <div className='mb-3 flex gap-2'>
            {pendentes.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.imagem}
                alt={p.descricao}
                title={p.descricao}
                className='h-10 w-10 rounded-lg border border-border object-cover'
              />
            ))}
            {pendentes.length > 4 && (
              <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-xs font-medium text-muted-foreground'>
                +{pendentes.length - 4}
              </div>
            )}
          </div>

          <Button
            size='sm'
            className='w-full gap-1'
            onClick={() => setDialogAberto(true)}
          >
            Avaliar agora
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <DialogPendentes
        open={dialogAberto}
        onClose={() => {
          setDialogAberto(false)
          dispensar()
        }}
        pendentes={pendentes}
      />
    </>
  )
}
