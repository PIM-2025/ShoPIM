import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/pages/auth/otp'

export const Route = createFileRoute('/(auth)/otp')({
  component: Otp,
})
