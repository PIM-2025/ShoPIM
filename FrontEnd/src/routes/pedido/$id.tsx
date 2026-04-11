import { createFileRoute, redirect } from '@tanstack/react-router'
import { HeaderLanding } from '@/components/layout/header_landingpage'
import { PedidoTracking } from '@/pages/pedido'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/pedido/$id')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState()?.auth?.user
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
  component: PedidoPage,
})

function PedidoPage() {
  const { id } = Route.useParams()
  return (
    <div>
      <HeaderLanding />
      <PedidoTracking id={Number(id)} />
    </div>
  )
}
