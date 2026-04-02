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
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    title: "Camiseta",
    price: 79.9,
    image: "https://via.placeholder.com/150"
  }
]

export default function App() {
  return (
    <div>  
      <HeaderLanding />

      <div className="bg-zinc-800">
        <CarouselBody />
      </div>

      {/* 🔥 GRID DE PRODUTOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
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