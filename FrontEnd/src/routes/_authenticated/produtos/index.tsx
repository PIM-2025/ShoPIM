import { createFileRoute } from '@tanstack/react-router'
import { Produtos } from '@/pages/produtos'

export const Route = createFileRoute('/_authenticated/produtos/')({
  component: Produtos,
})
