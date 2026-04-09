import { createFileRoute } from '@tanstack/react-router'
import PaginaRoupas from '@/features/pagina_roupas'

export const Route = createFileRoute('/roupas')({
  component: PaginaRoupas,
})