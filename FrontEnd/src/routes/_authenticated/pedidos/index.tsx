import { createFileRoute } from '@tanstack/react-router'
import { Pedidos } from '@/pages/pedidos'

export const Route = createFileRoute('/_authenticated/pedidos/')({
  component: Pedidos,
})
