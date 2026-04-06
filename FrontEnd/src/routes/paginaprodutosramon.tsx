import { createFileRoute } from "@tanstack/react-router"
import PaginaProduto from "@/features/PaginaProdutosRamon"

export const Route = createFileRoute('/paginaprodutosramon')({
  component: PaginaProduto
})

