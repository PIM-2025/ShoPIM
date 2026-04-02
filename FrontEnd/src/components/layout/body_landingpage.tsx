import blackFriday from "@/assets/black-friday.png"
import freteGratis from "@/assets/frete-gratis.png"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
    blackFriday,
    freteGratis
]

export function CarouselBody() {
  return (
    <Carousel className="w-screen relative">
  <CarouselContent>
    {images.map((src, index) => (
      <CarouselItem key={index}>
        <div className="w-full h-[180px] sm:h-[240px] md:h-auto overflow-hidden bg-black flex items-center justify-center">
          <img
            src={src}
            alt={`Imagem ${index + 1}`}
            className="
              w-full h-full
              object-cover
              md:object-contain
              md:h-auto
            "
          />
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>

  <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-10" />
  <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-10" />
</Carousel>
  )
}
