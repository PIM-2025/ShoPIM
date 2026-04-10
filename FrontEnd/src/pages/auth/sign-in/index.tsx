import { useState } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/stores/auth-store'
import { API_URL } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { LayoutDashboard, Loader2, Store } from 'lucide-react'
import { toast } from 'sonner'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  function handleAdminChoice(destination: '/dashboard' | '/') {
    setShowAdminDialog(false)
    navigate({ to: destination, replace: true })
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const userInfo = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        ).then((r) => r.json())

        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userInfo.email, nome: userInfo.name }),
        })

        const data = await res.json()

        if (res.ok) {
          const role = data.role === 1 ? 'admin' : 'user'
          auth.setUser({
            id: data.id,
            accountNo: data.email,
            email: data.email,
            name: data.nome,
            role: [role],
            exp: Date.now() + 8 * 60 * 60 * 1000,
            avatar: userInfo.picture,
          })
          auth.setAccessToken(data.jwt)

          if (role === 'admin') {
            setShowAdminDialog(true)
          } else {
            navigate({ to: redirect ?? '/', replace: true })
          }
        } else {
          toast.error('Erro ao autenticar com Google.')
        }
      } catch {
        toast.error('Erro ao autenticar com Google.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setGoogleLoading(false)
      toast.error('Login com Google cancelado ou falhou.')
    },
  })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Entrar</CardTitle>
          <CardDescription>
            Digite seu email e senha abaixo para acessar sua conta:
          </CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col gap-4'>
          <UserAuthForm
            redirectTo={redirect}
            onAdminLogin={() => setShowAdminDialog(true)}
          />

          <div className='relative flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-xs text-muted-foreground'>
              ou continue com
            </span>
            <div className='h-px flex-1 bg-border' />
          </div>

          <Button
            variant='outline'
            type='button'
            className='w-full gap-2'
            disabled={googleLoading}
            onClick={() => handleGoogleLogin()}
          >
            {googleLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <svg className='h-4 w-4' viewBox='0 0 24 24' aria-hidden='true'>
                <path style={{ fill: '#4285F4' }} d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path style={{ fill: '#34A853' }} d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path style={{ fill: '#FBBC05' }} d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' />
                <path style={{ fill: '#EA4335' }} d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
            )}
            {googleLoading ? 'Autenticando...' : 'Entrar com Google'}
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            Não tem uma conta?{' '}
            <a
              href='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Cadastre-se
            </a>
          </p>
        </CardContent>

        <CardFooter>
          <p className='text-center text-xs text-muted-foreground'>
            Ao entrar, você concorda com os nossos{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Política de Privacidade
            </a>
            .
          </p>
        </CardFooter>
      </Card>

      <Dialog open={showAdminDialog} onOpenChange={() => {}}>
        <DialogContent
          className='sm:max-w-md'
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Bem-vindo, administrador!</DialogTitle>
            <DialogDescription>
              Para onde você quer ir?
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-3 pt-2'>
            <Button
              className='w-full gap-2'
              onClick={() => handleAdminChoice('/dashboard')}
            >
              <LayoutDashboard size={16} />
              Acessar o Dashboard
            </Button>
            <Button
              variant='outline'
              className='w-full gap-2'
              onClick={() => handleAdminChoice('/')}
            >
              <Store size={16} />
              Continuar no site
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  )
}
