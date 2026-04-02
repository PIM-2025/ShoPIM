import { createFileRoute } from '@tanstack/react-router'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import Cart from '@/features/cart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  return (
    <div>
      <HeaderLanding />
      <Cart />
    </div>
  )
}
