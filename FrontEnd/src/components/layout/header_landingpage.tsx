import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "@/assets/ShoPIM-orange-removebg.png"

export function HeaderLanding() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        offset > 10 && "shadow"
      )}
    >
      <div
        className={cn(
          "relative flex h-16 items-center justify-between px-4",
          offset > 10 &&
            "after:absolute after:inset-0 after:-z-10 after:bg-background/70 after:backdrop-blur-lg"
        )}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <Separator orientation="vertical" className="h-6 hidden md:block" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#">Início</a>

          {/* DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1">
                Categorias
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>Eletrônicos</DropdownMenuItem>
              <DropdownMenuItem>Roupas</DropdownMenuItem>
              <DropdownMenuItem>Acessórios</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="#">Ofertas</a>
          <a href="/sign-in">Login</a>
          <ThemeSwitch />
        </nav>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              ☰
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col gap-4 mt-6">
              <a href="#">Início</a>

              <div className="flex flex-col gap-2">
                <span className="font-medium">Categorias</span>
                <div className="ml-2 flex flex-col gap-1 text-sm">
                  <a href="#">Eletrônicos</a>
                  <a href="#">Roupas</a>
                  <a href="#">Acessórios</a>
                </div>
              </div>

              <a href="#">Ofertas</a>
              <a href="/sign-in">Login</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}