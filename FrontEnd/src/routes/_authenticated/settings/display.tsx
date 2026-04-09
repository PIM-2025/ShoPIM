import { createFileRoute } from '@tanstack/react-router'
import { SettingsDisplay } from '@/pages/settings/display'

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: SettingsDisplay,
})
