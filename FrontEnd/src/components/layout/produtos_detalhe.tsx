import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ShoppingCart, Minus, Plus, PackageX, ChevronRight, Tag, Hash, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { useCart } from '@/hooks/useCart'
import { Produto } from '@/types/produtos'
import { getAvaliacoes } from '@/service/avaliacaoService'
import { Avaliacoes } from '@/components/layout/Avaliacoes'
import { GuiaTamanhos } from '@/components/layout/GuiaTamanhos'
import { CalculoFrete } from '@/components/layout/CalculoFrete'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/* ── Carousel de imagens ─────────────────────────────────────────── */
function ImagemCarousel({ produto }: { produto: Produto }) {
  const extras = produto.imagens
    ? produto.imagens.split('\n').map((u) => u.trim()).filter(Boolean)
    : []
  const todasImagens = [produto.imagem, ...extras].filter(Boolean)
  const esgotado = produto.quantidade === 0

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const scrollTo = useCallback((idx: number) => api?.scrollTo(idx), [api])

  if (todasImagens.length <= 1) {
    return (
      <div className='relative flex items-center justify-center rounded-2xl border border-border bg-zinc-100 p-8 dark:bg-zinc-900 min-h-[320px]'>
        {esgotado && (
          <span className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive'>
            <PackageX size={12} />
            Esgotado
          </span>
        )}
        <img
          src={produto.imagem}
          alt={produto.descricao}
          className={`max-h-[320px] w-full object-contain transition duration-300 ${esgotado ? 'opacity-40 grayscale' : ''}`}
        />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <Carousel setApi={setApi} className='w-full'>
        <CarouselContent>
          {todasImagens.map((src, idx) => (
            <CarouselItem key={idx}>
              <div className='relative flex items-center justify-center rounded-2xl border border-border bg-zinc-100 p-8 dark:bg-zinc-900 min-h-[320px]'>
                {esgotado && idx === 0 && (
                  <span className='absolute left-3 top-3 flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive'>
                    <PackageX size={12} />
                    Esgotado
                  </span>
                )}
                <img
                  src={src}
                  alt={`${produto.descricao} — foto ${idx + 1}`}
                  className={`max-h-[320px] w-full object-contain transition duration-300 ${esgotado ? 'opacity-40 grayscale' : ''}`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-2' />
        <CarouselNext className='right-2' />
      </Carousel>

      {/* Miniaturas */}
      <div className='flex justify-center gap-2'>
        {todasImagens.map((src, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              current === idx ? 'border-primary' : 'border-border opacity-60 hover:opacity-100'
            }`}
          >
            <img src={src} alt={`miniatura ${idx + 1}`} className='h-full w-full object-cover' />
          </button>
        ))}
      </div>
    </div>
  )
}

function EstrelasResumo({ idProduto }: { idProduto: number }) {
  const { data } = useQuery({
    queryKey: ['avaliacoes', idProduto],
    queryFn: () => getAvaliacoes(idProduto),
    staleTime: 60_000,
  })

  const total = data?.total ?? 0
  const media = data?.media ?? 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex items-center gap-2 rounded-lg px-1 py-0.5 transition hover:bg-muted'>
          <div className='flex gap-0.5'>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={16}
                className={
                  total > 0 && n <= Math.round(media)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted-foreground/30 text-muted-foreground/30'
                }
              />
            ))}
          </div>
          {total > 0 ? (
            <>
              <span className='text-sm font-semibold'>{media.toFixed(1)}</span>
              <span className='text-xs text-muted-foreground'>
                ({total} {total === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </>
          ) : (
            <span className='text-xs text-muted-foreground'>Sem avaliações ainda</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Star size={18} className='fill-yellow-400 text-yellow-400' />
            Avaliações do produto
          </DialogTitle>
        </DialogHeader>
        <Avaliacoes idProduto={idProduto} />
      </DialogContent>
    </Dialog>
  )
}

const CATEGORIA_LABEL: Record<string, string> = {
  eletronicos: 'Eletrônicos',
  roupas: 'Roupas',
  acessorios: 'Acessórios',
  ofertas: 'Ofertas',
  novidades: 'Novidades',
}

interface ProdutoDetalheProps {
  produto: Produto
}

export function ProdutoDetalhe({ produto }: ProdutoDetalheProps) {
  const { auth } = useAuthStore()
  const idUsuario = auth.user?.id ?? null
  const { adicionar } = useCart(idUsuario)
  const navigate = useNavigate()
  const esgotado = produto.quantidade === 0

  const [quantidade, setQuantidade] = useState(1)

  const decr = () => setQuantidade((q) => Math.max(1, q - 1))
  const incr = () => setQuantidade((q) => Math.min(produto.quantidade, q + 1))

  const handleAdicionarCarrinho = async () => {
    await adicionar(produto.id, quantidade, {
      id: produto.id,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      categoria: produto.categoria,
    })
    toast.success(`${produto.descricao} adicionado ao carrinho!`)
  }

  const handleComprarAgora = async () => {
    await handleAdicionarCarrinho()
    navigate({ to: '/cart' })
  }

  const categoriaLabel = CATEGORIA_LABEL[produto.categoria] ?? produto.categoria

  return (
    <div className='space-y-2'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1 text-xs text-muted-foreground'>
        <Link to='/' className='hover:text-foreground transition'>Início</Link>
        <ChevronRight size={12} />
        <Link
          to='/categoria/$slug'
          params={{ slug: produto.categoria }}
          className='hover:text-foreground transition capitalize'
        >
          {categoriaLabel}
        </Link>
        <ChevronRight size={12} />
        <span className='truncate max-w-[200px] text-foreground'>{produto.descricao}</span>
      </nav>

      {/* Layout principal */}
      <div className='grid grid-cols-1 gap-8 pt-2 md:grid-cols-2'>

        {/* ── Carousel de imagens ── */}
        <ImagemCarousel produto={produto} />

        {/* ── Informações + compra ── */}
        <div className='flex flex-col gap-5'>

          {/* Categoria */}
          <span className='flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground'>
            <Tag size={11} />
            {categoriaLabel}
          </span>

          {/* Nome */}
          <h1 className='text-2xl font-bold leading-snug text-foreground md:text-3xl'>
            {produto.descricao}
          </h1>

          {/* Estrelas */}
          <EstrelasResumo idProduto={produto.id} />

          {/* Preço */}
          <div>
            <p className='text-4xl font-extrabold text-foreground'>
              R$ {produto.preco.toFixed(2)}
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>à vista</p>
          </div>

          {/* Disponibilidade */}
          <p className={`flex items-center gap-1.5 text-sm font-medium ${esgotado ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${esgotado ? 'bg-destructive' : 'bg-green-500'}`} />
            {esgotado ? 'Produto esgotado' : `Em estoque · ${produto.quantidade} unidades disponíveis`}
          </p>

          <div className='h-px bg-border' />

          {/* Quantidade */}
          {!esgotado && (
            <div className='flex items-center gap-3'>
              <span className='text-sm text-muted-foreground'>Quantidade</span>
              <div className='flex items-center rounded-lg border border-border'>
                <button
                  onClick={decr}
                  disabled={quantidade <= 1}
                  className='flex h-9 w-9 items-center justify-center rounded-l-lg transition hover:bg-muted disabled:opacity-40'
                >
                  <Minus size={14} />
                </button>
                <span className='w-10 text-center text-sm font-medium tabular-nums'>
                  {quantidade}
                </span>
                <button
                  onClick={incr}
                  disabled={quantidade >= produto.quantidade}
                  className='flex h-9 w-9 items-center justify-center rounded-r-lg transition hover:bg-muted disabled:opacity-40'
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className='flex flex-col gap-3'>
            <button
              disabled={esgotado}
              onClick={handleAdicionarCarrinho}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
            >
              <ShoppingCart size={16} />
              Adicionar ao carrinho
            </button>

            <button
              disabled={esgotado}
              onClick={handleComprarAgora}
              className='w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40'
            >
              Comprar agora
            </button>

            <CalculoFrete />
          </div>

          <div className='h-px bg-border' />

          {/* Detalhes do produto */}
          <dl className='space-y-2 text-sm'>
            <div className='flex gap-2'>
              <dt className='flex items-center gap-1.5 text-muted-foreground'>
                <Tag size={13} /> Categoria
              </dt>
              <dd className='font-medium capitalize'>{categoriaLabel}</dd>
            </div>
            <div className='flex gap-2'>
              <dt className='flex items-center gap-1.5 text-muted-foreground'>
                <Hash size={13} /> Código
              </dt>
              <dd className='font-medium'>#{produto.id}</dd>
            </div>
          </dl>

          {/* Guia de tamanhos — só para roupas */}
          {produto.categoria === 'roupas' && (
            <GuiaTamanhos nomeProduto={produto.descricao} />
          )}
        </div>
      </div>
    </div>
  )
}
