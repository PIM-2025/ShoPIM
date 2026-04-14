import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, PackageSearch, ShoppingBag, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
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
import { useAuthStore } from '@/stores/auth-store'
import { getMeusPedidos } from '@/service/pedidoService'
import { criarAvaliacao } from '@/service/avaliacaoService'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  processando: 'Processando',
  enviado: 'Enviado',
  'concluído': 'Concluído',
  cancelado: 'Cancelado',
}

const STATUS_CLASS: Record<string, string> = {
  pendente: 'border-yellow-300 bg-yellow-100/30 text-yellow-800 dark:text-yellow-300',
  processando: 'border-blue-300 bg-blue-100/30 text-blue-800 dark:text-blue-300',
  enviado: 'border-purple-300 bg-purple-100/30 text-purple-800 dark:text-purple-300',
  'concluído': 'border-green-300 bg-green-100/30 text-green-800 dark:text-green-300',
  cancelado: 'border-red-300 bg-red-100/30 text-red-800 dark:text-red-300',
}

const NOTA_LABEL = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']

interface AvaliarDialogProps {
  idProduto: number
  nomeProduto: string
  imagem?: string
}

function AvaliarDialog({ idProduto, nomeProduto, imagem }: AvaliarDialogProps) {
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
            <img
              src={imagem}
              alt={nomeProduto}
              className='h-12 w-12 rounded-md object-cover'
            />
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

          <Button
            disabled={nota === 0 || isPending}
            onClick={() => mutate()}
            className='w-full'
          >
            {isPending && <Loader2 size={14} className='mr-2 animate-spin' />}
            Enviar avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MinhasCompras() {
  const { auth } = useAuthStore()
  const userId = auth.user?.id

  const { data: pedidos = [], isLoading } = useQuery({
    queryKey: ['meus-pedidos', userId],
    queryFn: () => getMeusPedidos(userId!),
    enabled: !!userId,
  })

  return (
    <div className='container mx-auto max-w-3xl px-4 py-10'>
      <div className='mb-6 flex items-center gap-3'>
        <ShoppingBag className='h-6 w-6' />
        <h1 className='text-2xl font-bold'>Meus Pedidos</h1>
      </div>

      {isLoading ? (
        <div className='flex min-h-[40vh] items-center justify-center'>
          <Loader2 size={28} className='animate-spin text-muted-foreground' />
        </div>
      ) : pedidos.length === 0 ? (
        <div className='flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center'>
          <PackageSearch className='h-14 w-14 text-muted-foreground' />
          <p className='font-medium'>Você ainda não fez nenhum pedido.</p>
          <Button asChild><Link to='/'>Começar a comprar</Link></Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {pedidos.map((pedido) => (
            <Card key={pedido.id}>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>Pedido #{pedido.id}</CardTitle>
                  <Badge variant='outline' className={cn('text-xs', STATUS_CLASS[pedido.status])}>
                    {STATUS_LABEL[pedido.status] ?? pedido.status}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {format(new Date(pedido.dataPedido), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-2'>
                  {pedido.itens.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      {item.imagem ? (
                        <img src={item.imagem} alt={item.descricao} className='h-10 w-10 rounded object-cover' />
                      ) : (
                        <div className='h-10 w-10 rounded bg-muted' />
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='truncate text-sm'>{item.descricao}</p>
                        <p className='text-xs text-muted-foreground'>Qtd: {item.quantidade}</p>
                      </div>
                      {pedido.status === 'concluído' && (
                        <AvaliarDialog
                          idProduto={item.idProduto}
                          nomeProduto={item.descricao}
                          imagem={item.imagem}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <p className='font-semibold'>R$ {pedido.total.toFixed(2)}</p>
                  <Button asChild size='sm' variant='outline'>
                    <Link to='/pedido/$id' params={{ id: String(pedido.id) }}>
                      Acompanhar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
