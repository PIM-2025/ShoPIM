import * as React from "react"

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
    <Carousel className="w-full mx-auto relative max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
  <CarouselContent>
    {images.map((src, index) => (
      <CarouselItem key={index}>
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={src}
            alt={`Imagem ${index + 1}`}
            className="w-full h-full object-cover"
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
