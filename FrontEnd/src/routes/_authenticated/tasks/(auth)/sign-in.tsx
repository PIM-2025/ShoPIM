import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional().catch(() => undefined),
})

export const Route = createFileRoute('/_authenticated/tasks/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
})
