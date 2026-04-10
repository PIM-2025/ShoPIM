import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState()?.auth?.user

    if (!user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    if (!user.role.includes('admin')) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthenticatedLayout,
})