import { createFileRoute } from '@tanstack/react-router'
import { EstabelecimentoSettings } from '@/pages/settings/estabelecimento'

export const Route = createFileRoute('/_authenticated/settings/estabelecimento')({
  component: EstabelecimentoSettings,
})
