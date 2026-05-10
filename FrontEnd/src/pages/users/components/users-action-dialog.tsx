'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCliente, updateCliente } from '@/service/clienteService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { roleOptions, statusOptions } from '../data/data'
import { type User } from '../data/schema'

const addSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'E-mail é obrigatório.' : undefined),
  }),
  cpf: z.string().optional(),
  senha: z
    .string()
    .min(7, 'Senha deve ter pelo menos 7 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
})

const editSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'E-mail é obrigatório.' : undefined),
  }),
  cpf: z.string().optional(),
  ativo: z.string().min(1, 'Status é obrigatório.'),
  role: z.string().min(1, 'Perfil é obrigatório.'),
})

type AddForm = z.infer<typeof addSchema>
type EditForm = z.infer<typeof editSchema>

type UsersActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UsersActionDialogProps) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const addForm = useForm<AddForm>({
    resolver: zodResolver(addSchema),
    defaultValues: { nome: '', email: '', cpf: '', senha: '' },
  })

  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: isEdit
      ? {
          nome: currentRow.nome,
          email: currentRow.email,
          cpf: currentRow.cpf ?? '',
          ativo: String(currentRow.ativo),
          role: String(currentRow.role),
        }
      : { nome: '', email: '', cpf: '', ativo: '1', role: '2' },
  })

  const addMutation = useMutation({
    mutationFn: (values: AddForm) =>
      createCliente({
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        cpf: values.cpf,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário criado com sucesso!')
      addForm.reset()
      onOpenChange(false)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      toast.error(msg ?? 'Erro ao criar usuário.')
    },
  })

  const editMutation = useMutation({
    mutationFn: (values: EditForm) =>
      updateCliente(currentRow!.id, {
        nome: values.nome,
        email: values.email,
        cpf: values.cpf || null,
        ativo: Number(values.ativo),
        role: Number(values.role),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário atualizado!')
      editForm.reset()
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário.')
    },
  })

  const handleClose = (state: boolean) => {
    addForm.reset()
    editForm.reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do usuário.'
              : 'Preencha os dados do novo usuário.'}{' '}
            Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <Form {...editForm}>
            <form
              id='user-form'
              onSubmit={editForm.handleSubmit((v) => editMutation.mutate(v))}
              className='space-y-4 px-0.5 py-1'
            >
              <FormField
                control={editForm.control}
                name='nome'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='João da Silva'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='joao@email.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='cpf'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='00000000000'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='ativo'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Selecione'
                      className='col-span-4'
                      items={statusOptions.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Perfil
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Selecione'
                      className='col-span-4'
                      items={roleOptions.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : (
          <Form {...addForm}>
            <form
              id='user-form'
              onSubmit={addForm.handleSubmit((v) => addMutation.mutate(v))}
              className='space-y-4 px-0.5 py-1'
            >
              <FormField
                control={addForm.control}
                name='nome'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='João da Silva'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='joao@email.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name='cpf'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='00000000000'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name='senha'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Senha</FormLabel>
                    <FormControl>
                      <div className='col-span-4'>
                        <PasswordInput
                          placeholder='Mínimo 7 caracteres, com maiúscula, minúscula, número e especial'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        <DialogFooter>
          <Button
            type='submit'
            form='user-form'
            disabled={addMutation.isPending || editMutation.isPending}
          >
            {addMutation.isPending || editMutation.isPending
              ? 'Salvando...'
              : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
