import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingCart, User, House, ChevronDown, Menu, X } from 'lucide-react'
import logoDark from '@/assets/logo_dark.png'
import logoLight from '@/assets/logo_light.png'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { SearchBar } from '@/components/search_landing'
import { ThemeSwitch } from '@/components/theme-switch'

type Category = {
  label: string
  href: string
  description: string
}

const categories: Category[] = [
  {
    label: 'Eletrônicos',
    href: '#',
    description: 'Smartphones, notebooks e mais',
  },
  { label: 'Roupas', href: '#', description: 'Moda masculina e feminina' },
  { label: 'Acessórios', href: '#', description: 'Bolsas, relógios e joias' },
]

function CategoryItem({ cat }: { cat: Category }) {
  return (
    <a
      href={cat.href}
      className='flex flex-col rounded-md px-3 py-2 transition-colors hover:bg-accent'
    >
      <span className='text-sm font-medium text-foreground'>{cat.label}</span>
      <span className='text-xs text-muted-foreground'>{cat.description}</span>
    </a>
  )
}

function CategoryItemMobile({ cat }: { cat: Category }) {
  return (
    <a
      href={cat.href}
      className='rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
    >
      {cat.label}
    </a>
  )
}

export function HeaderLanding() {
  const [offset, setOffset] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const [openCategoryMobile, setOpenCategoryMobile] = useState(false)
  const [openCategoryDesktop, setOpenCategoryDesktop] = useState(false)

  useEffect(() => {
    const onScroll = () => setOffset(document.documentElement.scrollTop)
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains('dark'))
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const scrolled = offset > 10

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        scrolled &&
          'border-border/40 bg-background/80 shadow-sm backdrop-blur-lg'
      )}
    >
      <div className='mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 md:px-6'>
        {/* ESQUERDA — Logo + Nav */}
        <div className='flex items-center gap-1'>
          <a href='/' className='mr-2 flex shrink-0 items-center'>
            <img
              src={isDark ? logoDark : logoLight}
              alt='ShoPIM'
              className='h-9 w-auto'
            />
          </a>

          <div className='hidden items-center gap-1 md:flex'>
            <div
              className='relative'
              onMouseEnter={() => setOpenCategoryDesktop(true)}
              onMouseLeave={() => setOpenCategoryDesktop(false)}
            >
              <button className='flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'>
                <ChevronDown
                  size={15}
                  className={cn(
                    'transition-transform duration-200',
                    openCategoryDesktop && 'rotate-180'
                  )}
                />
                Categorias
              </button>

              {openCategoryDesktop && (
                <div className='absolute top-full left-0 mt-1 flex min-w-[200px] flex-col gap-0.5 rounded-lg border border-border bg-popover p-1.5 shadow-md'>
                  {categories.map((cat) => (
                    <CategoryItem key={cat.label} cat={cat} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTRO — Search */}
        <div className='hidden justify-center md:flex'>
          <SearchBar className='w-full max-w-sm' />
        </div>

        {/* DIREITA — Carrinho + ThemeSwitch + Login */}
        <div className='hidden items-center justify-end gap-2 md:flex'>
          <Link
            to='/cart'
            className='relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
          >
            <ShoppingCart size={18} />
            <Badge className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]'>
              3
            </Badge>
          </Link>

          <ThemeSwitch />
          <Separator orientation='vertical' className='h-5 opacity-50' />

          <a
            href='/sign-in'
            className='flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
          >
            <User size={14} />
            Login
          </a>
        </div>

        {/* MOBILE */}
        <div className='col-span-2 flex min-w-0 items-center justify-end gap-2 md:hidden'>
          <SearchBar className='min-w-0 flex-1' placeholder='Buscar...' />
          <Sheet>
            <SheetTrigger asChild>
              <button className='flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent'>
                <Menu size={18} />
              </button>
            </SheetTrigger>

            <SheetContent side='left' className='w-72 p-0'>
              <div className='flex h-16 items-center justify-between border-b px-4'>
                <img
                  src={isDark ? logoDark : logoLight}
                  alt='ShoPIM'
                  className='h-10 w-auto'
                />
                <SheetClose className='flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent'>
                  <X size={16} />
                </SheetClose>
              </div>

              <nav className='flex flex-col gap-1 p-3'>
                <a
                  href='#'
                  className='flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
                >
                  <House size={16} className='text-muted-foreground' />
                  Início
                </a>

                <div className='flex flex-col'>
                  <button
                    onClick={() => setOpenCategoryMobile(!openCategoryMobile)}
                    className='flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
                  >
                    <ChevronDown
                      size={16}
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        openCategoryMobile && 'rotate-180'
                      )}
                    />
                    Categorias
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200',
                      openCategoryMobile ? 'max-h-48' : 'max-h-0'
                    )}
                  >
                    <div className='ml-9 flex flex-col gap-0.5 pb-1'>
                      {categories.map((cat) => (
                        <CategoryItemMobile key={cat.label} cat={cat} />
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  to='/cart'
                  className='flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent'
                >
                  <ShoppingCart size={16} className='text-muted-foreground' />
                  Carrinho
                  <Badge className='ml-auto h-5 px-1.5 text-xs'>3</Badge>
                </Link>

                <Separator className='my-2' />

                <div className='flex items-center justify-between rounded-md px-3 py-2.5'>
                  <span className='text-sm font-medium'>Tema</span>
                  <ThemeSwitch />
                </div>

                <a
                  href='/sign-in'
                  className='flex items-center gap-2.5 rounded-md bg-foreground px-3 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
                >
                  <User size={16} />
                  Entrar na conta
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
