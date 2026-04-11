import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

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
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!apiReady || !apiRef.current) return
    const api = apiRef.current

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    onSelect()

    const interval = setInterval(() => api.scrollNext(), 8000)

    return () => {
      clearInterval(interval)
      api.off('select', onSelect)
    }
  }, [apiReady])

  return (
    <div className="relative">
      <Carousel
        opts={{ loop: true }}
        setApi={(api) => {
          apiRef.current = api
          setApiReady(true)
        }}
        className="w-screen"
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={src}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => apiRef.current?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
            )}
          />
        ))}
      </div>
    </div>
  )
}