import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'

export const Route = createFileRoute('/_authenticated/tasks/(auth)/otp')({
  component: Otp,
})
