import { HeaderLanding } from "@/components/layout/header_landingpage"
import { CarouselBody } from "@/components/layout/body_landingpage"
import { Card } from "@/components/layout/cards"

type Product = {
  id: number
  title: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    title: "Tênis Nike",
    price: 299.9,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_604949-MLB100975386367_122025-F-tnis-nike-quest-6-masculino.webp"
  },
  {
    id: 2,
    title: "Camiseta",
    price: 79.9,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_629175-MLB105997289209_012026-F-camisa-social-masculina-slim-premium-manga-longa-curta.webp"
  },
  {
    id: 3,
    title: "IPhone 15 (250bg)",
    price: 6389.9,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_972898-MLA95936460027_102025-F.webp"
  },
  {
    id: 4,
    title: "Relogio",
    price: 199.89,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_682402-MLA99403901858_112025-F.webp"
  }
]

export default function App() {
  return (
    <div>  
      <HeaderLanding />

      <div className="bg-zinc-800">
        <CarouselBody />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <Card
            key={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      <main className="p-4"></main>
    </div>
  )
}