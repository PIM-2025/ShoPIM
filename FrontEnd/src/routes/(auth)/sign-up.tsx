import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/pages/auth/sign-up'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
})
