import { useNavigate, useRouterState, Link } from '@tanstack/react-router'
import { LayoutDashboard, Store, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()
  const navigate = useNavigate()
  const location = useRouterState({ select: (s) => s.location.pathname })

  const isAdmin = auth.user?.role.includes('admin') ?? false
  const ADMIN_PREFIXES = ['/dashboard', '/chats', '/clientes', '/produtos', '/pedidos', '/users', '/settings', '/help-center']
  const onAdminArea = ADMIN_PREFIXES.some((p) => location.startsWith(p))

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={auth.user?.avatar ?? ''}
                alt={auth.user?.name ?? ''}
              />
              <AvatarFallback>
                {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>
                {auth.user?.name || 'Usuário'}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {auth.user?.email || ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => navigate({ to: onAdminArea ? '/' : '/dashboard' })}
            >
              {onAdminArea ? (
                <>
                  <Store className='mr-2 h-4 w-4' />
                  Abrir Site
                </>
              ) : (
                <>
                  <LayoutDashboard className='mr-2 h-4 w-4' />
                  Acessar Dashboard
                </>
              )}
            </DropdownMenuItem>
          )}
          {isAdmin && !onAdminArea && (
            <DropdownMenuItem asChild>
              <Link to='/minhas-compras'>
                <ShoppingBag className='mr-2 h-4 w-4' />
                Minhas Compras
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            Sair
            <DropdownMenuShortcut className='text-current'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
