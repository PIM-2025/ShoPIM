import { createFileRoute } from '@tanstack/react-router'
import PaginaRoupas from '@/pages/pagina_roupas'

export const Route = createFileRoute('/roupas')({
  component: PaginaRoupas,
})
