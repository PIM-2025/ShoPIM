import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Laptop, Shirt, Gem } from 'lucide-react'
import { getProdutos } from '@/service/produtoservice'
import { Produto } from '@/types/produtos'
import { CarouselBody } from '@/components/layout/body_landingpage'
import { Card } from '@/components/layout/cards'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { Rodape } from '@/components/layout/rodape'
import { AvaliacaoPendentePopup } from '@/components/layout/AvaliacaoPendentePopup'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Eletrônicos', slug: 'eletronicos', description: 'Smartphones, notebooks e mais', icon: Laptop },
  { label: 'Roupas',      slug: 'roupas',      description: 'Moda masculina e feminina',    icon: Shirt  },
  { label: 'Acessórios',  slug: 'acessorios',  description: 'Bolsas, relógios e joias',     icon: Gem    },
]

type Ordem = 'relevancia' | 'menor-preco' | 'maior-preco'
type FiltroCategoria = 'todos' | 'eletronicos' | 'roupas' | 'acessorios'

const ORDENS: { value: Ordem; label: string }[] = [
  { value: 'relevancia',   label: 'Relevância'   },
  { value: 'menor-preco',  label: 'Menor preço'  },
  { value: 'maior-preco',  label: 'Maior preço'  },
]

const FILTROS: { value: FiltroCategoria; label: string }[] = [
  { value: 'todos',       label: 'Todos'       },
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'roupas',      label: 'Roupas'      },
  { value: 'acessorios',  label: 'Acessórios'  },
]

function CardSkeleton() {
  return (
    <div className='rounded-2xl border border-border bg-zinc-100 p-4 dark:bg-zinc-800'>
      <Skeleton className='h-36 w-full rounded-xl sm:h-40' />
      <Skeleton className='mt-3 h-4 w-3/4' />
      <Skeleton className='mt-1.5 h-4 w-1/2' />
      <Skeleton className='mt-1.5 h-3 w-1/3' />
      <div className='mt-3 flex gap-2'>
        <Skeleton className='h-8 flex-[3] rounded-lg' />
        <Skeleton className='h-8 flex-[1] rounded-lg' />
      </div>
    </div>
  )
}

export default function App() {
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<FiltroCategoria>('todos')
  const [ordem, setOrdem] = useState<Ordem>('relevancia')

  useEffect(() => {
    getProdutos()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = products

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter((p) => p.descricao.toLowerCase().includes(term))
    }

    if (filtroCategoria !== 'todos') {
      result = result.filter((p) => p.categoria === filtroCategoria)
    }

    if (ordem === 'menor-preco') result = [...result].sort((a, b) => a.preco - b.preco)
    if (ordem === 'maior-preco') result = [...result].sort((a, b) => b.preco - a.preco)

    return result
  }, [products, search, filtroCategoria, ordem])

  return (
    <div className='flex min-h-screen flex-col'>
      <HeaderLanding searchValue={search} onSearch={setSearch} />

      <div className='bg-zinc-800'>
        <CarouselBody />
      </div>

      {/* CATEGORIAS */}
      <section className='mx-auto hidden w-full max-w-7xl px-4 pt-6 pb-6 sm:block md:px-6 md:pt-10'>
        <h2 className='mb-3 text-lg font-semibold sm:mb-4 sm:text-xl'>Categorias</h2>

        <div className='grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-4'>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to='/categoria/$slug'
              params={{ slug: cat.slug }}
              className='group flex items-start gap-3 rounded-2xl border border-border bg-zinc-100 p-4 transition duration-200 hover:border-orange-600 hover:shadow-md sm:items-center sm:gap-4 sm:p-6 dark:bg-zinc-800'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white transition group-hover:bg-orange-700 sm:h-12 sm:w-12'>
                <cat.icon size={20} className='sm:size-[22px]' />
              </div>

              <div className='min-w-0'>
                <p className='font-semibold text-foreground'>{cat.label}</p>
                <p className='line-clamp-2 text-[11px] text-muted-foreground sm:text-xs'>
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUTOS */}
      <section className='mx-auto w-full max-w-7xl px-4 pb-10 md:px-6'>

        {/* Cabeçalho + contagem */}
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold'>
              {search.trim() ? `Resultados para "${search}"` : 'Todos os produtos'}
            </h2>
            {!loading && (
              <p className='mt-0.5 text-sm text-muted-foreground'>
                {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} encontrados
              </p>
            )}
          </div>
          {search.trim() && (
            <button
              onClick={() => setSearch('')}
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* Filtros rápidos de categoria + ordenação */}
        <div className='mb-6 hidden sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2'>
          {/* Categorias */}
          <div className='overflow-x-auto pb-1'>
            <div className='flex w-max gap-2'>
              {FILTROS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltroCategoria(f.value)}
                  className={cn(
                    'whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition',
                    filtroCategoria === f.value
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-border bg-zinc-100 text-muted-foreground hover:border-orange-600 hover:text-foreground dark:bg-zinc-800'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação */}
          <div className='overflow-x-auto pb-1'>
            <div className='flex w-max gap-2'>
              {ORDENS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOrdem(o.value)}
                  className={cn(
                    'whitespace-nowrap rounded-full border px-3 py-1 text-sm transition',
                    ordem === o.value
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-border bg-zinc-100 text-muted-foreground hover:border-orange-600 hover:text-foreground dark:bg-zinc-800'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <p className='col-span-4 py-12 text-center text-muted-foreground'>
              Nenhum produto encontrado.
            </p>
          ) : (
            filtered.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                title={product.descricao}
                price={product.preco}
                image={product.imagem}
                categoria={product.categoria}
                quantidade={product.quantidade}
              />
            ))
          )}
        </div>
      </section>

      <div className='mt-auto'>
        <Rodape />
      </div>

      <AvaliacaoPendentePopup />
    </div>
  )
}
