import { createFileRoute, redirect } from '@tanstack/react-router'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { MinhasCompras } from '@/pages/minhas-compras'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/minhas-compras')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState()?.auth?.user
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
  component: MinhasComprasPage,
})

function MinhasComprasPage() {
  return (
    <div>
      <HeaderLanding />
      <MinhasCompras />
    </div>
  )
}
