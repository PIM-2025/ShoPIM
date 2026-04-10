import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingCart, User, ChevronDown, Menu, X, Search } from 'lucide-react'
import logoDark from '@/assets/logo_dark.png'
import logoLight from '@/assets/logo_light.png'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { ProfileDropdown } from '@/components/profile-dropdown'
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
    href: 'eletronicos',
    description: 'Smartphones, notebooks e mais',
  },
  { label: 'Roupas', href: 'roupas', description: 'Moda masculina e feminina' },
  {
    label: 'Acessórios',
    href: 'acessorios',
    description: 'Bolsas, relógios e joias',
  },
]

function CategoryItem({ cat }: { cat: Category }) {
  return (
    <Link
      to='/categoria/$slug'
      params={{ slug: cat.href }}
      className='flex flex-col rounded-md px-3 py-2 transition-colors hover:bg-accent'
    >
      <span className='text-sm font-medium text-foreground'>{cat.label}</span>
      <span className='text-xs text-muted-foreground'>{cat.description}</span>
    </Link>
  )
}

function CategoryItemMobile({ cat }: { cat: Category }) {
  return (
    <Link
      to='/categoria/$slug'
      params={{ slug: cat.href }}
      className='rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
    >
      {cat.label}
    </Link>
  )
}

interface HeaderLandingProps {
  searchValue?: string
  onSearch?: (v: string) => void
}

export function HeaderLanding({
  searchValue,
  onSearch,
}: HeaderLandingProps = {}) {
  const { auth } = useAuthStore()
  const { items } = useCartStore()
  const totalItens = items.reduce((sum, item) => sum + item.quantidade, 0)

  const [offset, setOffset] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const [openCategoryMobile, setOpenCategoryMobile] = useState(false)
  const [openCategoryDesktop, setOpenCategoryDesktop] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileSearchRef = useRef<HTMLInputElement>(null)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenCategoryDesktop(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenCategoryDesktop(false), 150)
  }

  const handlePillClick = () => {
    setMobileSearchOpen(true)
    setTimeout(() => mobileSearchRef.current?.focus(), 50)
  }

  const handleMobileSearchBlur = () => {
    if (!searchValue) setMobileSearchOpen(false)
  }

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
      {/* ── DESKTOP ─────────────────────────────────────────────────── */}
      <div className='mx-auto hidden h-16 max-w-7xl grid-cols-3 items-center px-4 md:grid md:px-6'>
        {/* ESQUERDA — Logo + Nav */}
        <div className='flex items-center gap-1'>
          <Link to='/' className='mr-2 flex shrink-0 items-center'>
            <img
              src={isDark ? logoDark : logoLight}
              alt='ShoPIM'
              className='h-9 w-auto'
            />
          </Link>

          <div className='flex items-center gap-1'>
            <div
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
                <div
                  className='absolute top-full left-0 mt-1 flex min-w-[200px] flex-col gap-0.5 rounded-lg border border-border bg-popover p-1.5 shadow-md'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {categories.map((cat) => (
                    <CategoryItem key={cat.label} cat={cat} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTRO — Search */}
        <div className='flex justify-center'>
          <SearchBar
            className='w-full max-w-sm'
            value={searchValue}
            onChange={onSearch}
          />
        </div>

        {/* DIREITA — Carrinho + ThemeSwitch + Login */}
        <div className='flex items-center justify-end gap-2'>
          <Link
            to='/cart'
            className='relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
          >
            <ShoppingCart size={18} />
            {totalItens > 0 && (
              <Badge className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]'>
                {totalItens}
              </Badge>
            )}
          </Link>

          <ThemeSwitch />
          <Separator orientation='vertical' className='h-5 opacity-50' />

          {auth.user ? (
            <ProfileDropdown />
          ) : (
            <Link
              to='/sign-in'
              className='flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
            >
              <User size={14} />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────────── */}
      <div className='mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:hidden'>
        {/* Logo — some quando busca está aberta para dar mais espaço */}
        {!mobileSearchOpen && (
          <Link to='/' className='flex shrink-0 items-center'>
            <img
              src={isDark ? logoDark : logoLight}
              alt='ShoPIM'
              className='h-9 w-auto'
            />
          </Link>
        )}

        {/* Search pill / input expansível */}
        <div className='relative flex min-w-0 flex-1'>
          {!mobileSearchOpen ? (
            /* Pill estática */
            <button
              onClick={handlePillClick}
              className='flex h-8 w-full items-center gap-2 rounded-full bg-muted px-3 text-left transition-colors hover:bg-muted/80 active:scale-[0.98]'
            >
              <Search size={13} className='shrink-0 text-muted-foreground' />
              <span className='truncate text-xs text-muted-foreground'>
                {searchValue || 'Buscar produtos…'}
              </span>
            </button>
          ) : (
            /* SearchBar real expandida */
            <SearchBar
              ref={mobileSearchRef}
              className='w-full'
              placeholder='Buscar produtos…'
              value={searchValue}
              onChange={onSearch}
              onBlur={handleMobileSearchBlur}
              autoFocus
            />
          )}
        </div>

        {/* Ações direita */}
        <div className='flex shrink-0 items-center gap-1'>
          {/* Carrinho */}
          {!mobileSearchOpen && (
            <Link
              to='/cart'
              className='relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            >
              <ShoppingCart size={18} />
              {totalItens > 0 && (
                <Badge className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center p-0 text-[10px]'>
                  {totalItens}
                </Badge>
              )}
            </Link>
          )}

          {!mobileSearchOpen && (
            <Separator orientation='vertical' className='h-5 opacity-50' />
          )}

          {/* Login ou perfil */}
          {!mobileSearchOpen && (
            <>
              {auth.user ? (
                <ProfileDropdown />
              ) : (
                <Link
                  to='/sign-in'
                  className='flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90'
                >
                  <User size={14} />
                  Entrar
                </Link>
              )}
              <Separator orientation='vertical' className='h-5 opacity-50' />
            </>
          )}

          {/* Cancelar busca (só aparece quando expandida) ou Menu */}
          {mobileSearchOpen ? (
            <button
              onClick={() => {
                setMobileSearchOpen(false)
                onSearch?.('')
              }}
              className='flex h-9 items-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            >
              Cancelar
            </button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <button className='flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'>
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

                  <Separator className='my-2' />

                  <div className='flex items-center justify-between rounded-md px-3 py-2.5'>
                    <span className='text-sm font-medium'>Tema</span>
                    <ThemeSwitch />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
