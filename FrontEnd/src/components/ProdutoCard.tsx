import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { Produto } from '@/types/produtos'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/stores/auth-store'

export function ProdutoCard({ produto }: { produto: Produto }) {
  const { auth } = useAuthStore()
  const idUsuario = auth.user?.id ?? null
  const { adicionar } = useCart(idUsuario)
  const navigate = useNavigate()
  const esgotado = produto.quantidade === 0

  return (
    <div className='relative bg-zinc-100 dark:bg-zinc-800 border border-border rounded-2xl p-4 w-full transition duration-300 hover:shadow-2xl hover:-translate-y-1 dark:hover:shadow-white/10'>
      {/* IMAGEM */}
      <div className='w-full h-40 rounded-xl flex items-center justify-center'>
        <img
          src={produto.imagem}
          alt={produto.descricao}
          className={`max-h-full max-w-full object-contain transition ${esgotado ? 'opacity-40' : ''}`}
        />
      </div>

      {/* BADGE ESGOTADO */}
      {esgotado && (
        <span className='absolute top-3 right-3 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
          Esgotado
        </span>
      )}

      {/* TÍTULO */}
      <h2 className='text-lg font-semibold mt-3 text-foreground'>
        {produto.descricao}
      </h2>

      {/* PREÇO */}
      <p className='text-muted-foreground'>R$ {produto.preco.toFixed(2)}</p>

      {/* BOTÕES */}
      <div className='flex gap-2 mt-4'>
        <button
          disabled={esgotado}
          onClick={() => navigate({ to: '/produto/$id', params: { id: String(produto.id) } })}
          className='flex-[3] bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed'
        >
          Comprar
        </button>

        <button
          disabled={esgotado}
          className='flex-[1] bg-orange-600 text-white flex items-center justify-center rounded-lg hover:bg-orange-900 transition disabled:opacity-40 disabled:cursor-not-allowed'
          onClick={async () => {
            await adicionar(produto.id, 1, {
              id: produto.id,
              descricao: produto.descricao,
              preco: produto.preco,
              imagem: produto.imagem,
              categoria: produto.categoria,
            })
            toast.success(`${produto.descricao} adicionado ao carrinho!`)
          }}
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  )
}
