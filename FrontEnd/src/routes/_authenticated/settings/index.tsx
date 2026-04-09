import { createFileRoute } from '@tanstack/react-router'
import { SettingsProfile } from '@/pages/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
