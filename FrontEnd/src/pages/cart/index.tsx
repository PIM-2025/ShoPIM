import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CartItem } from '@/service/cartservice'
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Package,
  Shield,
  CreditCard,
  Store,
  MoveRight,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 15.99

export default function Cart() {
  const navigate = useNavigate()
  const [isRemoving, setIsRemoving] = useState<number | null>(null)

  const { auth } = useAuthStore()
  const idUsuario = auth.user?.id ?? null
  const { items, loading, atualizar, remover } = useCart(idUsuario)

  const handleUpdateQuantidade = async (item: CartItem, increment: boolean) => {
    await atualizar(item, increment)
  }

  const handleRemover = async (id: number) => {
    setIsRemoving(id)
    const item = items.find((i) => i.id === id)
    if (item) await remover(item)
    setTimeout(() => setIsRemoving(null), 300)
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  )
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center text-muted-foreground'>
        Carregando carrinho...
      </div>
    )

  return (
    <div className='container mx-auto max-w-7xl px-4 py-8'>
      <div className='mb-8 space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
          Seu carrinho de compras
        </h1>
        <p className='text-muted-foreground'>
          {items.length} {items.length === 1 ? 'item' : 'itens'} no seu carrinho
          •{' '}
          <span className='font-semibold text-foreground'>
            R${subtotal.toFixed(2)}
          </span>
        </p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='flex-1 space-y-6'>
          {items.length === 0 ? (
            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <ShoppingBag className='mb-4 size-12 text-muted-foreground/50' />
                <h3 className='text-lg font-medium'>Seu carrinho está vazio</h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Adicione alguns itens para começar
                </p>
                <Button
                  className='mt-4'
                  variant='outline'
                  onClick={() => navigate({ to: '/' })}
                >
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                className={cn('gap-0 overflow-hidden py-0', {
                  'opacity-50': isRemoving === item.id,
                })}
              >
                <div className='flex flex-col sm:flex-row'>
                  <div className='relative h-auto w-full sm:w-40'>
                    <img
                      src={item.produto.imagem}
                      alt={item.produto.descricao}
                      className='h-36 w-full object-cover object-center'
                    />
                  </div>

                  <div className='flex-1 p-4'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='text-lg font-medium text-foreground'>
                          {item.produto.descricao}
                        </h3>
                        <p className='mt-1 text-sm text-muted-foreground capitalize'>
                          {item.produto.categoria}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                        onClick={() => handleRemover(item.id)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>

                    <div className='mt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='size-8'
                          onClick={() => handleUpdateQuantidade(item, false)}
                          disabled={item.quantidade <= 1}
                        >
                          <Minus className='size-3' />
                        </Button>
                        <span className='w-8 text-center text-sm font-medium'>
                          {item.quantidade}
                        </span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='size-8'
                          onClick={() => handleUpdateQuantidade(item, true)}
                        >
                          <Plus className='size-3' />
                        </Button>
                      </div>

                      <p className='text-lg font-semibold'>
                        R${(item.produto.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <CardFooter className='border-t bg-muted/20 px-4 !py-2'>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Package className='me-2 size-4' />
                    <span>Entrega estimada: 3-7 dias úteis</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className='w-full space-y-4 lg:w-96'>
          <Card className='sticky top-4 gap-0'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl'>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>R${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Frete</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Grátis' : `R$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator className='my-2' />

              <div className='flex items-center justify-between text-base font-medium'>
                <span>Total</span>
                <div className='text-end'>
                  <p className='text-xl font-bold'>R${total.toFixed(2)}</p>
                  <p className='text-xs text-muted-foreground'>
                    incluindo impostos, se aplicável
                  </p>
                </div>
              </div>

              <Button
                size='lg'
                className='mt-4 w-full text-base font-medium'
                disabled={items.length === 0}
                onClick={() => navigate({ to: '/checkout' })}
              >
                <ShoppingBag className='me-2 size-5' />
                Ir para o Checkout
              </Button>

              <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                <CreditCard className='size-3.5' />
                <span>Pagamento seguro com criptografia SSL</span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-dashed py-4'>
            <CardContent className='px-4'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
                  <Shield className='size-5' />
                </div>
                <div>
                  <h4 className='font-medium'>Checkout Seguro</h4>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Suas informações de pagamento são criptografadas e seguras.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => navigate({ to: '/' })}
          >
            <Store className='me-2 size-4' />
            Continuar Comprando
            <MoveRight className='ms-2 size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
