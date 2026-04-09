// src/pages/CategoriaProdutosPage.tsx
import { useParams, Link } from '@tanstack/react-router'
import { Categoria } from '@/types/produtos'
import { cn } from '@/lib/utils'
import { useProdutos, OrdemTipo } from '@/hooks/useProdutos'
import { ProdutoCard } from '@/components/ProdutoCard'
import { HeaderLanding } from '@/components/layout/header_landingpage'

const ordens: { value: OrdemTipo; label: string }[] = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
]

const categoriasMenu: { slug: Categoria; label: string }[] = [
  { slug: 'roupas', label: 'Roupas' },
  { slug: 'eletronicos', label: 'Eletrônicos' },
  { slug: 'acessorios', label: 'Acessórios' },
]

export function CategoriaProdutosPage() {
  const { slug } = useParams({ from: '/categoria/$slug' })
  const categoria = slug as Categoria

  const { produtos, loading, ordem, setOrdem, soEstoque, setSoEstoque } =
    useProdutos(categoria)

  return (
    <>
      <HeaderLanding />

      <div className='flex min-h-screen'>
        {/* Sidebar */}
        <aside className='hidden w-48 shrink-0 border-r px-4 py-6 md:block'>
          <p className='mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            Coleções
          </p>
          <ul className='space-y-1'>
            {categoriasMenu.map((c) => (
              <li key={c.slug}>
                <Link
                  to='/categoria/$slug'
                  params={{ slug: c.slug }}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                    categoria === c.slug
                      ? 'bg-primary font-medium text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo */}
        <main className='flex-1 px-4 py-6'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
            <h1 className='text-lg font-semibold capitalize'>
              {categoriasMenu.find((c) => c.slug === categoria)?.icon}{' '}
              {categoriasMenu.find((c) => c.slug === categoria)?.label}
            </h1>

            <div className='flex flex-wrap items-center gap-3'>
              <label className='flex cursor-pointer items-center gap-1.5 text-sm'>
                <input
                  type='checkbox'
                  checked={soEstoque}
                  onChange={(e) => setSoEstoque(e.target.checked)}
                  className='accent-primary'
                />
                Só em estoque
              </label>

              <div className='flex gap-1'>
                {ordens.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setOrdem(o.value)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs transition-colors',
                      ordem === o.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className='aspect-square animate-pulse rounded-xl bg-muted'
                />
              ))}
            </div>
          ) : produtos.length === 0 ? (
            <p className='mt-20 text-center text-sm text-muted-foreground'>
              Nenhum produto encontrado.
            </p>
          ) : (
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
              {produtos.map((p) => (
                <ProdutoCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
