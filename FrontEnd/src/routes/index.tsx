import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '@/pages/landingpage'

export const Route = createFileRoute('/')({
  component: LandingPage,
})
