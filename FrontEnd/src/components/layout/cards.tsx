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
        bg-background         /* fundo padrão do tema (light/dark automático) */
        border border-border  /* adiciona borda com cor do tema */
        rounded-2xl          /* bordas bem arredondadas */
        
        p-4                  /* padding interno (espaçamento dentro do card) */
        w-full               /* ocupa 100% da largura disponível */

        transition           /* ativa transições suaves */
        duration-300         /* duração da animação (300ms) */

        hover:shadow-2xl     /* sombra forte ao passar o mouse */
        hover:-translate-y-1 /* sobe levemente o card no hover */

        dark:hover:shadow-white/10 /* sombra clara no modo dark (pra aparecer melhor) */
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