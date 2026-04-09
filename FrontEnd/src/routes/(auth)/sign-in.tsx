import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/pages/auth/sign-in'

const searchSchema = z.object({
  redirect: z
    .string()
    .optional()
    .catch(() => undefined),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
})
