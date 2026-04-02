import { ShoppingCart } from "lucide-react"

type CardProps = {
  title: string
  price: number
  image: string
}

export function Card({ title, price, image }: CardProps) {
  return (
<div
  className="
    bg-white dark:bg-zinc-800
    border border-border
    rounded-2xl
    
    p-4 w-full

    transition duration-300
    hover:shadow-2xl hover:-translate-y-1
    dark:hover:shadow-white/10
  "
>
  
      
      {/* IMAGEM */}
      <div className="w-full h-40 rounded-xl flex items-center justify-center">
        <img 
          src={image} 
          alt={title} 
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* TÍTULO */}
      <h2 className="text-lg font-semibold mt-3 text-foreground">
        {title}
      </h2>

      {/* PREÇO */}
      <p className="text-muted-foreground">
        R$ {price.toFixed(2)}
      </p>

      {/* BOTÕES */}
      <div className="flex gap-2 mt-4">
        
        {/* Comprar */}
        <button className="flex-[3] bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition">
          Comprar
        </button>

        {/* Carrinho */}
        <button className="flex-[1] bg-orange-600 text-white flex items-center justify-center rounded-lg hover:bg-orange-900 transition">
          <ShoppingCart size={18} />
        </button>

      </div>

    </div>
  )
}