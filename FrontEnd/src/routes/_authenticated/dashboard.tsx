import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/pages/dashboard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
