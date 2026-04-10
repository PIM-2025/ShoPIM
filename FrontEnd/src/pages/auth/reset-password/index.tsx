import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { resetPassword } from '@/service/authService'
import { cn } from '@/lib/utils'
import { AuthLayout } from '../auth-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

const formSchema = z
  .object({
    novaSenha: z.string().min(7, 'A senha deve ter pelo menos 7 caracteres.'),
    confirmar: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((d) => d.novaSenha === d.confirmar, {
    message: 'As senhas não coincidem.',
    path: ['confirmar'],
  })

export function ResetPassword() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { novaSenha: '', confirmar: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const token = sessionStorage.getItem('reset_token')
    if (!token) {
      toast.error('Sessão expirada. Solicite um novo código.')
      navigate({ to: '/forgot-password' })
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(token, data.novaSenha)
      sessionStorage.removeItem('reset_token')
      sessionStorage.removeItem('reset_email')
      toast.success('Senha redefinida com sucesso!')
      navigate({ to: '/sign-in' })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao redefinir senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Nova senha</CardTitle>
          <CardDescription>
            Escolha uma senha forte para proteger sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('grid gap-3')}
            >
              <FormField
                control={form.control}
                name='novaSenha'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='Mínimo 7 caracteres' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='Repita a senha' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='mt-2' disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {isLoading ? 'Salvando...' : 'Redefinir senha'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
