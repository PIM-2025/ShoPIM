import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { cadastro } from '@/service/authService'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
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

const formSchema = z
  .object({
    nome: z.string().min(1, 'Por favor, insira seu nome.'),
    email: z.string().email({ message: 'Por favor, insira seu e-mail.' }),
    password: z
      .string()
      .min(1, 'Por favor, insira sua senha.')
      .min(7, 'A senha deve ter pelo menos 7 caracteres.')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
      .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
    confirmPassword: z.string().min(1, 'Por favor, confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

const passwordRules = [
  { label: 'Pelo menos 7 caracteres', test: (v: string) => v.length >= 7 },
  { label: 'Uma letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Uma letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Um número', test: (v: string) => /[0-9]/.test(v) },
  {
    label: 'Um caractere especial',
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
]

function PasswordChecklist({ value }: { value: string }) {
  if (!value) return null

  return (
    <ul className='mt-1 space-y-1'>
      {passwordRules.map(({ label, test }) => {
        const passed = test(value)
        return (
          <li
            key={label}
            className={cn(
              'flex items-center gap-1.5 text-xs',
              passed ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {passed ? <Check className='size-3' /> : <X className='size-3' />}
            {label}
          </li>
        )
      })}
    </ul>
  )
}

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', email: '', password: '', confirmPassword: '' },
  })

  const passwordValue = form.watch('password')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await cadastro(data.nome, data.email, data.password)
      toast.success('Conta criada com sucesso!')
      navigate({ to: '/sign-in', replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao criar conta.')
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
          name='nome'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Seu nome completo' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='********'
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  {...field}
                />
              </FormControl>
              <PasswordChecklist value={passwordValue} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='********'
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Criar Conta
        </Button>
      </form>
    </Form>
  )
}
