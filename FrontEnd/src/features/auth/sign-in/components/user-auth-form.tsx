import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { login } from '@/service/authService'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira seu e-mail.' }),
  password: z
    .string()
    .min(1, 'Por favor, insira sua senha.')
    .min(7, 'A senha deve ter pelo menos 7 caracteres.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await login(data.email, data.password)

      const role = result.role ?? 2

      auth.setUser({
        accountNo: result.email,
        email: result.email,
        name: result.nome,
        role: [role === 1 ? 'admin' : 'user'],
        exp: Date.now() + 8 * 60 * 60 * 1000,
        avatar: '',
      })
      auth.setAccessToken(result.jwt)

      toast.success(`Bem-vindo(a) de volta, ${result.nome}!`)

      if (role === 1) {
        navigate({ to: '/dashboard', replace: true })
      } else {
        navigate({ to: redirectTo ?? '/', replace: true })
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'E-mail ou senha inválidos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder='nome@exemplo.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute end-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Esqueceu a senha?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Entrar
        </Button>
      </form>
    </Form>
  )
}
