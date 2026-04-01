import { createFileRoute } from "@tanstack/react-router"
import LandingPage from "@/features/landingpage"

export const Route = createFileRoute("/")({
  component: LandingPage,
})