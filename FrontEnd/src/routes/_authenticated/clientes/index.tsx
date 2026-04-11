import { createFileRoute } from '@tanstack/react-router'
import { Clientes } from '@/pages/clientes'

export const Route = createFileRoute('/_authenticated/clientes/')({
  component: Clientes,
})
