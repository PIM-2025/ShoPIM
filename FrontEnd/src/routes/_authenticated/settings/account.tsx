import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/pages/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
