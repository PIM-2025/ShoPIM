import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Verificação de código
          </CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para o seu e-mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Não recebeu o código?{' '}
            <Link
              to='/forgot-password'
              className='underline underline-offset-4 hover:text-primary'
            >
              Solicitar novamente.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
