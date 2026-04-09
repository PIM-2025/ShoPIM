import { useEffect, useState } from 'react'
import { getProdutos } from '@/service/produtoservice'
import { Produto } from '@/types/produtos'
import { CarouselBody } from '@/components/layout/body_landingpage'
import { Card } from '@/components/layout/cards'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { Rodape } from '@/components/layout/rodape'

export default function App() {
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProdutos()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='flex min-h-screen flex-col'>
      <HeaderLanding />

      <div className='bg-zinc-800'>
        <CarouselBody />
      </div>

      <div className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {loading ? (
          <p className='col-span-4 text-center text-zinc-500'>
            Carregando produtos...
          </p>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              title={product.descricao}
              price={product.preco}
              image={product.imagem}
            />
          ))
        )}
      </div>

      <div className='mt-auto'>
        <Rodape />
      </div>
    </div>
  )
}
