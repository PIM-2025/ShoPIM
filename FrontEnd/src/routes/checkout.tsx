import { createFileRoute, redirect } from '@tanstack/react-router'
import Checkout from '@/pages/checkout'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/checkout')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState()?.auth?.user
    if (!user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }
  },
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
