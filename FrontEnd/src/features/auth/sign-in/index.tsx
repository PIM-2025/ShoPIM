import { useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldDescription } from '@/components/ui/field'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Entrar</CardTitle>
          <CardDescription>
            Digite seu email e senha abaixo para acessar sua conta:
            <br />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
          <Button variant='outline' type='button' className='center'>
            Login with Google
          </Button>
          <FieldDescription className='text-center'>
            Não tem uma conta? <a href='/sign-up'>Cadastre-se</a>
          </FieldDescription>
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Ao clicar em Entrar, você concorda com os nossos{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Termos de Serviço
            </a>{' '}
            and{' '}
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
    </AuthLayout>
  )
}
