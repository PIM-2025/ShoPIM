import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [open, setOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)

  return (
    <header className="bg-muted p-4 text-foreground">
      <div className="flex items-center justify-between">
        
        <img src="/ShoPIM-removebg.png" className="h-12" />

        <nav className="hidden md:flex gap-6 items-center">
          <a href="#">Início</a>
          <a href="#">Categorias</a>
          <a href="#">Ofertas</a>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          ☰
        </Button>
      </div>

      {/* Sidebar mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Button
          variant="ghost"
          className="m-2"
          onClick={() => setOpen(false)}
        >
          ✕
        </Button>

        <nav className="flex flex-col gap-4 p-4">
          <a href="#">Início</a>

          <div>
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="flex justify-between w-full"
            >
              Categorias
              <span>{openCategory ? "▲" : "▼"}</span>
            </button>

            {openCategory && (
              <div className="ml-4 mt-2 flex flex-col gap-2 text-sm">
                <a href="#">Eletrônicos</a>
                <a href="#">Roupas</a>
                <a href="#">Acessórios</a>
              </div>
            )}
          </div>

          <a href="#">Ofertas</a>
        </nav>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  )
}