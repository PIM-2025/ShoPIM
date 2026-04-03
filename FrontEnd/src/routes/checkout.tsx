import { createFileRoute } from '@tanstack/react-router'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import Checkout from '@/features/checkout'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  return (
    <div>
      <HeaderLanding />
      <Checkout />
    </div>
  )
}
