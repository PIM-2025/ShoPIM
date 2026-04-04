import { createFileRoute } from "@tanstack/react-router"
import PaginaProduto from "@/features/paginaProdutos"

export const Route = createFileRoute('/paginaProdutos')({
  component: PaginaProduto
})