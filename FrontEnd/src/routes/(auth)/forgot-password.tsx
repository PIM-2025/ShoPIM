import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/pages/auth/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
