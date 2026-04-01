import React from "react"
import { cn } from "@/lib/utils"

export function StoreLogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-10 h-10", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Fundo com bordas arredondadas */}
      <rect width="100" height="100" rx="20" fill="#1b3260" />

      {/* Alça da sacola */}
      <path
        d="M 38 28 V 24 A 12 12 0 0 1 62 24 V 28"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Corpo da sacola */}
      <path
        d="M 30 28 L 70 28 L 76 74 A 4 4 0 0 1 72 79 L 28 79 A 4 4 0 0 1 24 74 Z"
        fill="#FFFFFF"
      />

      {/* Seta vermelha com contorno azul para criar o efeito de "corte" sobre a sacola */}
      <path
        d="M 23 38 C 5 65, 45 80, 75 48 L 70 45 L 89 33 L 83 53 L 78 49 C 45 76, 15 58, 23 38 Z"
        fill="#EF4444"
        stroke="#1b3260"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}