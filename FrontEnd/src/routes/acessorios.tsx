import { createFileRoute } from '@tanstack/react-router'
import PaginaAcessorios from '@/pages/pagina_acessorios'

export const Route = createFileRoute('/acessorios')({
  component: PaginaAcessorios,
})
