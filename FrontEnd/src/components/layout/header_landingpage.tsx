import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, User, House, ChevronDown, Menu} from "lucide-react"
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import logoDark from "@/assets/ShoPIM-orange-removebg.png"
import logoLight from "@/assets/ShoPIM-light-tema.png"

export function HeaderLanding() {
  const [offset, setOffset] = useState(0)

  const [isDark, setIsDark] = useState(false)

  // estados separados
  const [openCategoryMobile, setOpenCategoryMobile] = useState(false)
  const [openCategoryDesktop, setOpenCategoryDesktop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
  const checkTheme = () => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }

  checkTheme()

  // observa mudanças na classe do HTML
  const observer = new MutationObserver(checkTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  return () => observer.disconnect()
}, [])

  const currentLogo = isDark ? logoDark : logoLight

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
         <img src={currentLogo} alt="Logo" className="h-10" />
          <Separator orientation="vertical" className="h-6 hidden md:block" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 relative">
          <a href="#" className="flex items-center gap-2 transition-transform duration-300 hover:scale-110">
            <House />
            Início
          </a>

          {/* CATEGORIAS DESKTOP (HOVER) */}
          <div
            className="relative"
            onMouseEnter={() => setOpenCategoryDesktop(true)}
            onMouseLeave={() => setOpenCategoryDesktop(false)}
          >
            <button className="flex items-center gap-2 transition-transform duration-300 hover:scale-110">
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openCategoryDesktop ? "rotate-180" : "rotate-0"
                }`}
              />
              Categorias
            </button>

            {openCategoryDesktop && (
              
              <div className="absolute top-full bg-background shadow-md rounded-md p-2 flex flex-col gap-1 min-w-[150px]">
                <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300 hover:scale-110">
                  Eletrônicos
                </a>
                <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300 hover:scale-110">
                  Roupas
                </a>
                <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300 hover:scale-110">
                  Acessórios
                </a>
              </div>
            )}
          </div>

          <a href="#" className="flex items-center gap-2 transition-transform duration-300 hover:scale-110">
            <ShoppingCart size={18} />
            Carrinho
          </a>
          <a href="/sign-in" className="flex items-center gap-2 transition-transform duration-300 hover:scale-110">
            <User size={18} />
            Login
          </a>
          <ThemeSwitch />
        </nav>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu/>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col gap-4 mt-6">
              <a href="#" className="flex items-center gap-2 transition-transform duration-300 ml-2">
                <House />
                Início
              </a>

              {/* CATEGORIAS MOBILE (CLICK) */}
              <div className="flex flex-col gap-2">
                <button
                onClick={() => setOpenCategoryMobile(!openCategoryMobile)}
                className="flex items-center gap-2 transition-transform duration-300 ml-2"
              >
                <ChevronDown
                  className={`
                    transition-all duration-300
                    ${openCategoryMobile ? "rotate-180" : "rotate-0"}
                  `}
                />
                Categorias
              </button>

                {openCategoryMobile && (
                  <div className="ml-2 flex flex-col gap-1 text-sm">
                    <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300">
                      Eletrônicos
                    </a>
                    <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300">
                      Roupas
                    </a>
                    <a href="#" className="hover:bg-muted px-2 py-1 rounded transition-transform duration-300">
                      Acessórios
                    </a>
                  </div>
                )}
              </div>

              <a href="#" className="flex items-center gap-2 transition-transform duration-300 ml-3">
                <ShoppingCart size={18} />
                Carrinho
              </a>
              <a href="/sign-in" className="flex items-center gap-2 transition-transform duration-300 ml-3">
                <User size={18} />
                Login
              </a>
              <ThemeSwitch /> 
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}