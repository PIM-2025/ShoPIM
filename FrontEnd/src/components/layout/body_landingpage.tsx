import { useEffect, useRef, useState } from "react"

import promoRoupa from "@/assets/promoRoupa.png"
import freteGratis from "@/assets/frete-gratis.png"
import promocao from "@/assets/promocao.png"
import kitInformatica from "@/assets/kit-informatica.png"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
  promoRoupa,
  promocao,
  kitInformatica,
  freteGratis,
]

export function CarouselBody() {
  const apiRef = useRef<any>(null)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    if (!apiReady) return

    const interval = setInterval(() => {
      apiRef.current?.scrollNext()
    }, 8000)

    return () => clearInterval(interval)
  }, [apiReady])

  return (
    <Carousel
      opts={{ loop: true }}
      setApi={(api) => {
        apiRef.current = api
        setApiReady(true)
      }}
      className="w-screen relative"
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="w-full h-[180px] sm:h-[240px] md:h-auto overflow-hidden bg-black flex items-center justify-center">
              <img
                src={src}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover md:object-contain md:h-auto"
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