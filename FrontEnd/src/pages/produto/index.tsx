import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { getProduto } from '@/service/produtoservice'
import { Produto } from '@/types/produtos'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { Rodape } from '@/components/layout/rodape'
import { ProdutoDetalhe } from '@/components/layout/produtos_detalhe'
import { Skeleton } from '@/components/ui/skeleton'

function ProdutoDetalheSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-3'>
      <div className='md:col-span-1'>
        <Skeleton className='h-[300px] w-full rounded-xl' />
      </div>
      <div className='space-y-4 md:col-span-1'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-10 w-1/2' />
      </div>
      <div className='md:col-span-1'>
        <Skeleton className='h-[200px] w-full rounded-xl' />
      </div>
    </div>
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
          <ProdutoDetalhe produto={produto} />
        )}
      </main>

      <Rodape />
    </div>
  )
}
