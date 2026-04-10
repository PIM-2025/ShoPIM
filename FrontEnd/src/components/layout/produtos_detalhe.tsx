import { useNavigate } from '@tanstack/react-router'
import { Produto } from '@/types/produtos'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useCart } from '@/hooks/useCart'

interface ProdutoDetalheProps {
  produto: Produto
}

export function ProdutoDetalhe({ produto }: ProdutoDetalheProps) {
  const { auth } = useAuthStore()
  const idUsuario = auth.user?.id ?? null
  const { adicionar } = useCart(idUsuario)
  const navigate = useNavigate()
  const esgotado = produto.quantidade === 0

  const handleAdicionarCarrinho = async () => {
    await adicionar(produto.id, 1, {
      id: produto.id,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: produto.imagem,
      categoria: produto.categoria,
    })
    toast.success(`${produto.descricao} adicionado ao carrinho!`)
  }

  const handleComprarAgora = async () => {
    await handleAdicionarCarrinho()
    navigate({ to: '/cart' })
  }

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      {/* IMAGEM */}
      <div className='md:col-span-1'>
        <div className='flex items-center justify-center rounded-xl border border-border bg-zinc-100 p-6 dark:bg-zinc-900'>
          <img
            src={produto.imagem}
            alt={produto.descricao}
            className={`max-h-[320px] object-contain transition ${esgotado ? 'opacity-40' : ''}`}
          />
        </div>
      </div>

      {/* INFO */}
      <div className='space-y-4 md:col-span-1'>
        <p className='text-sm text-muted-foreground capitalize'>
          {produto.categoria}
        </p>

        <h1 className='text-2xl font-bold text-foreground'>
          {produto.descricao}
        </h1>

        <div className='text-3xl font-bold text-foreground'>
          R$ {produto.preco.toFixed(2)}
        </div>

        <p
          className={`text-sm font-medium ${esgotado ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}
        >
          {esgotado
            ? 'Produto esgotado'
            : `Em estoque (${produto.quantidade} unidades)`}
        </p>
      </div>

      {/* COMPRA */}
      <div className='md:col-span-1'>
        <div className='space-y-4 rounded-xl border border-border bg-background p-6'>
          <p className='text-2xl font-bold'>R$ {produto.preco.toFixed(2)}</p>

          <p
            className={`text-sm font-medium ${esgotado ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}
          >
            {esgotado ? 'Esgotado' : 'Em estoque'}
          </p>

          <button
            disabled={esgotado}
            onClick={handleAdicionarCarrinho}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
          >
            <ShoppingCart size={16} />
            Adicionar ao carrinho
          </button>

          <button
            disabled={esgotado}
            onClick={handleComprarAgora}
            className='w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40'
          >
            Comprar agora
          </button>
        </div>
      </div>
    </div>
  )
}
