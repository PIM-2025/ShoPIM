import { createFileRoute } from '@tanstack/react-router'
import Checkout from '@/pages/checkout'
import { HeaderLanding } from '@/components/layout/header_landingpage'

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
