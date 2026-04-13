import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Link } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth-store"
import { useCart } from "@/hooks/useCart"

type CardProps = {
  id: number
  title: string
  price: number
  image: string
  categoria: string
  quantidade: number
}

export function Card({ id, title, price, image, categoria, quantidade }: CardProps) {
  const { auth } = useAuthStore()
  const idUsuario = auth.user?.id ?? null
  const { adicionar } = useCart(idUsuario)
  const esgotado = quantidade === 0

  return (
    <div className="relative bg-zinc-100 dark:bg-zinc-800 border border-border rounded-2xl p-4 w-full transition duration-300 hover:shadow-2xl hover:-translate-y-1 dark:hover:shadow-white/10">

      {/* ÁREA CLICÁVEL — imagem, título e preço */}
      <Link to='/produto/$id' params={{ id: String(id) }} className="block">
        {/* IMAGEM */}
        <div className="w-full h-36 sm:h-40 rounded-xl flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            className={`max-h-full max-w-full object-contain transition ${esgotado ? 'opacity-40' : ''}`}
          />
        </div>

        {/* BADGE ESGOTADO */}
        {esgotado && (
          <span className="absolute top-3 right-3 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Esgotado
          </span>
        )}

        {/* TÍTULO */}
        <h2 className="text-sm sm:text-base font-semibold mt-3 text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </h2>

        {/* PREÇO */}
        <p className="text-sm text-muted-foreground mt-1">
          R$ {price.toFixed(2)}
        </p>
      </Link>

      {/* BOTÕES */}
      <div className="flex gap-2 mt-3">
        <Link
          to='/produto/$id'
          params={{ id: String(id) }}
          className={`flex-[3] text-center bg-primary text-primary-foreground py-1.5 sm:py-2 text-sm rounded-lg hover:opacity-90 transition ${esgotado ? 'pointer-events-none opacity-40' : ''}`}
        >
          Comprar
        </Link>

        <button
          disabled={esgotado}
          className="flex-[1] bg-orange-600 text-white flex items-center justify-center rounded-lg hover:bg-orange-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={async () => {
            await adicionar(id, 1, { id, descricao: title, preco: price, imagem: image, categoria })
            toast.success(`${title} adicionado ao carrinho!`)
          }}
        >
          <ShoppingCart size={16} />
        </button>
      </div>

    </div>
  )
}
