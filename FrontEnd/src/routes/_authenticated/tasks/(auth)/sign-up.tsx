import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/pages/auth/sign-up'

export const Route = createFileRoute('/_authenticated/tasks/(auth)/sign-up')({
  component: SignUp,
})
