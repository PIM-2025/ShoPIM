import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { getProduto } from '@/service/produtoservice'
import { Produto } from '@/types/produtos'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { Rodape } from '@/components/layout/rodape'
import { ProdutoDetalhe } from '@/components/layout/produtos_detalhe'
import { Avaliacoes } from '@/components/layout/Avaliacoes'
import { Perguntas } from '@/components/layout/Perguntas'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { FileText, MessageCircle, Star } from 'lucide-react'

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
          <>
            <ProdutoDetalhe produto={produto} />

            <Tabs defaultValue='descricao' className='mt-10'>
              <TabsList className='mb-6'>
                <TabsTrigger value='descricao' className='flex items-center gap-1.5'>
                  <FileText size={14} />
                  Descrição
                </TabsTrigger>
                <TabsTrigger value='perguntas' className='flex items-center gap-1.5'>
                  <MessageCircle size={14} />
                  Perguntas
                </TabsTrigger>
                <TabsTrigger value='avaliacoes' className='flex items-center gap-1.5'>
                  <Star size={14} />
                  Avaliações
                </TabsTrigger>
              </TabsList>

              <TabsContent value='descricao'>
                {produto.descricaoDetalhada ? (
                  <div className='prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-xl border border-border p-6 text-sm leading-relaxed'>
                    {produto.descricaoDetalhada}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Nenhuma descrição detalhada cadastrada para este produto.
                  </p>
                )}
              </TabsContent>

              <TabsContent value='perguntas'>
                <Perguntas idProduto={produto.id} />
              </TabsContent>

              <TabsContent value='avaliacoes'>
                <Avaliacoes idProduto={produto.id} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <Rodape />
    </div>
  )
}
