import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { getProduto } from '@/service/produtoservice'
import { Produto } from '@/types/produtos'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { Rodape } from '@/components/layout/rodape'
import { ProdutoDetalhe } from '@/components/layout/produtos_detalhe'
import { Perguntas } from '@/components/layout/Perguntas'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'

const DESCRICAO_LIMITE = 500

function ProdutoDetalheSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
      <Skeleton className='h-[360px] w-full rounded-xl' />
      <div className='space-y-4'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  )
}

function SecaoDescricao({ descricao }: { descricao: string | undefined }) {
  const [expandido, setExpandido] = useState(false)
  const longa = (descricao?.length ?? 0) > DESCRICAO_LIMITE
  const textoExibido =
    longa && !expandido ? descricao!.slice(0, DESCRICAO_LIMITE) + '…' : descricao

  return (
    <section>
      <h2 className='mb-4 text-xl font-bold text-foreground'>Descrição do produto</h2>
      {descricao ? (
        <div className='rounded-xl border border-border bg-muted/20 p-6'>
          <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground/80'>
            {textoExibido}
          </p>
          {longa && (
            <button
              onClick={() => setExpandido((e) => !e)}
              className='mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline'
            >
              {expandido ? (
                <>
                  <ChevronUp size={15} />
                  Recolher descrição
                </>
              ) : (
                <>
                  <ChevronDown size={15} />
                  Ver descrição completa
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          Nenhuma descrição detalhada cadastrada para este produto.
        </p>
      )}
    </section>
  )
}

export function ProdutoDetalhePage() {
  const { id } = useParams({ from: '/produto/$id' })
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    setLoading(true)
    setErro(false)
    getProduto(Number(id))
      .then(setProduto)
      .catch(() => setErro(true))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className='flex min-h-screen flex-col'>
      <HeaderLanding />

      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6'>
        {loading ? (
          <ProdutoDetalheSkeleton />
        ) : erro || !produto ? (
          <p className='py-20 text-center text-muted-foreground'>
            Produto não encontrado.
          </p>
        ) : (
          <div className='space-y-10'>
            <ProdutoDetalhe produto={produto} />

            <hr className='border-border' />

            <SecaoDescricao descricao={produto.descricaoDetalhada} />

            <hr className='border-border' />

            <section className='pb-4'>
              <h2 className='mb-6 flex items-center gap-2 text-xl font-bold text-foreground'>
                <MessageCircle size={20} className='text-primary' />
                Perguntas e respostas
              </h2>
              <Perguntas idProduto={produto.id} />
            </section>
          </div>
        )}
      </main>

      <Rodape />
    </div>
  )
}
