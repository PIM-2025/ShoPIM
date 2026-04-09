import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/pages/auth/forgot-password'

export const Route = createFileRoute(
  '/_authenticated/tasks/(auth)/forgot-password'
)({
  component: ForgotPassword,
})
