import { createFileRoute } from '@tanstack/react-router'
import Cart from '@/pages/cart'
import { HeaderLanding } from '@/components/layout/header_landingpage'

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
