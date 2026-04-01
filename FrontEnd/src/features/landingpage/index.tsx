import { Header } from "@/components/layout/header_landingpage"
import { CarouselBody } from "@/components/layout/body_landingpage"

export default function App() {
  return (
    <div>  
        <Header />
        <div className="bg-black">
          <CarouselBody />
        </div>
      <main className="p-4"></main>
    </div>
  )
}