import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getPedido } from '@/service/pedidoService'
import { criarAvaliacao } from '@/service/avaliacaoService'
import { ptBR } from 'date-fns/locale'
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const NOTA_LABEL = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']

function AvaliarDialog({
  idProduto,
  nomeProduto,
  imagem,
}: {
  idProduto: number
  nomeProduto: string
  imagem?: string
}) {
  const [open, setOpen] = useState(false)
  const [nota, setNota] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [avaliado, setAvaliado] = useState(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => criarAvaliacao({ idProduto, nota, comentario }),
    onSuccess: () => {
      toast.success('Avaliação enviada!')
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', idProduto] })
      setAvaliado(true)
      setOpen(false)
    },
    onError: () => toast.error('Erro ao enviar avaliação.'),
  })

  if (avaliado) {
    return (
      <span className='flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400'>
        <Star size={12} className='fill-yellow-400 text-yellow-400' />
        Avaliado
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline' className='h-7 gap-1 px-2 text-xs'>
          <Star size={12} />
          Avaliar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Avaliar produto</DialogTitle>
        </DialogHeader>
        <div className='flex items-center gap-3 rounded-lg bg-muted/40 p-3'>
          {imagem && (
            <img src={imagem} alt={nomeProduto} className='h-12 w-12 rounded-md object-cover' />
          )}
          <p className='text-sm font-medium leading-snug'>{nomeProduto}</p>
        </div>
        <div className='space-y-4'>
          <div>
            <p className='mb-2 text-sm text-muted-foreground'>Sua nota</p>
            <div className='flex items-center gap-2'>
              <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={26}
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
                <span className='text-sm text-muted-foreground'>{NOTA_LABEL[nota]}</span>
              )}
            </div>
          </div>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder='Deixe um comentário (opcional)'
            maxLength={1000}
            rows={3}
            className='w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary'
          />
          <Button disabled={nota === 0 || isPending} onClick={() => mutate()} className='w-full'>
            {isPending && <Loader2 size={14} className='mr-2 animate-spin' />}
            Enviar avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ETAPAS = [
  { status: 'pendente', label: 'Pedido recebido', icon: ShoppingBag },
  { status: 'processando', label: 'Em processamento', icon: Package },
  { status: 'enviado', label: 'Enviado', icon: Truck },
  { status: 'concluído', label: 'Concluído', icon: CheckCircle2 },
]

const STATUS_ORDER = ['pendente', 'processando', 'enviado', 'concluído']

interface Props {
  id: number
}

export function PedidoTracking({ id }: Props) {
  const { data: pedido, isLoading } = useQuery({
    queryKey: ['pedido', id],
    queryFn: () => getPedido(id),
    refetchInterval: 30_000,
  })

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Loader2 size={28} className='animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Pedido não encontrado.</p>
        <Button asChild>
          <Link to='/'>Voltar ao início</Link>
        </Button>
      </div>
    )
  }

  const etapaAtual = STATUS_ORDER.indexOf(pedido.status)

  return (
    <div className='container mx-auto max-w-2xl px-4 py-10'>
      {/* Confirmação */}
      <div className='mb-8 text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
            <CheckCircle2 className='h-8 w-8 text-green-600' />
          </div>
        </div>
        <h1 className='text-2xl font-bold'>Pedido #{pedido.id}</h1>
        <p className='mt-1 text-muted-foreground'>
          Realizado em{' '}
          {format(
            new Date(pedido.dataPedido),
            "d 'de' MMMM 'de' yyyy 'às' HH:mm",
            { locale: ptBR }
          )}
        </p>
      </div>

      {/* Tracker de status */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='text-base'>Acompanhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-start justify-between'>
            {ETAPAS.map((etapa, idx) => {
              const concluido = idx <= etapaAtual
              const atual = idx === etapaAtual
              const Icon = etapa.icon
              return (
                <div
                  key={etapa.status}
                  className='flex flex-1 flex-col items-center'
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      concluido
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-muted text-muted-foreground'
                    } ${atual ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <Icon className='h-4 w-4' />
                  </div>
                  <p
                    className={`mt-2 text-center text-xs ${concluido ? 'font-medium' : 'text-muted-foreground'}`}
                  >
                    {etapa.label}
                  </p>
                  {idx < ETAPAS.length - 1 && (
                    <div
                      className={`absolute mt-5 h-0.5 w-full max-w-[80px] translate-x-[60%] transition-colors ${idx < etapaAtual ? 'bg-primary' : 'bg-muted'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Itens */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='text-base'>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {pedido.itens.map((item, idx) => (
            <div key={idx} className='flex items-center gap-4'>
              {item.imagem ? (
                <img
                  src={item.imagem}
                  alt={item.descricao}
                  className='h-14 w-14 rounded-lg object-cover'
                />
              ) : (
                <div className='h-14 w-14 rounded-lg bg-muted' />
              )}
              <div className='flex-1'>
                <p className='text-sm font-medium'>{item.descricao}</p>
                <p className='text-xs text-muted-foreground'>
                  Qtd: {item.quantidade}
                </p>
              </div>
              <p className='text-sm font-medium'>
                R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
              </p>
            </div>
          ))}
          <Separator />
          <div className='flex justify-between font-semibold'>
            <span>Total</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      {pedido.endereco && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <MapPin className='h-4 w-4' /> Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground'>
            <p>
              {pedido.endereco.rua}, {pedido.endereco.numero}
              {pedido.endereco.complemento
                ? ` — ${pedido.endereco.complemento}`
                : ''}
            </p>
            <p>
              {pedido.endereco.cidade} — {pedido.endereco.estado}
            </p>
            <p>CEP: {pedido.endereco.cep}</p>
          </CardContent>
        </Card>
      )}

      {/* Avalie seus produtos */}
      {pedido.status === 'concluído' && (
        <Card className='mb-6 border-yellow-200 bg-yellow-50/40 dark:border-yellow-900/40 dark:bg-yellow-900/10'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Star size={16} className='fill-yellow-400 text-yellow-400' />
              Avalie seus produtos
            </CardTitle>
            <p className='text-xs text-muted-foreground'>
              Sua opinião ajuda outros compradores.
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            {pedido.itens.map((item, idx) => (
              <div key={idx} className='flex items-center gap-3'>
                {item.imagem ? (
                  <img src={item.imagem} alt={item.descricao} className='h-10 w-10 rounded-lg object-cover' />
                ) : (
                  <div className='h-10 w-10 rounded-lg bg-muted' />
                )}
                <p className='flex-1 truncate text-sm font-medium'>{item.descricao}</p>
                <AvaliarDialog
                  idProduto={item.idProduto}
                  nomeProduto={item.descricao}
                  imagem={item.imagem}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className='flex gap-3'>
        <Button asChild variant='outline' className='flex-1'>
          <Link to='/minhas-compras'>Meus Pedidos</Link>
        </Button>
        <Button asChild className='flex-1'>
          <Link to='/'>Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  )
}
