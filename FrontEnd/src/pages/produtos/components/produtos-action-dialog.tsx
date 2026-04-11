'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduto, updateProduto } from '@/service/produtoservice'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { categorias } from '../data/data'
import { type Produto } from '../data/schema'

const formSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória.'),
  preco: z.coerce.number().min(0, 'Preço deve ser maior ou igual a 0.'),
  categoria: z.string().min(1, 'Categoria é obrigatória.'),
  quantidade: z.coerce
    .number()
    .min(0, 'Quantidade deve ser maior ou igual a 0.'),
  imagem: z.string().optional().default(''),
})

type ProdutoFormInput = z.input<typeof formSchema>
type ProdutoForm = z.output<typeof formSchema>

type Props = {
  currentRow?: Produto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProdutosActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<ProdutoFormInput, unknown, ProdutoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          descricao: currentRow.descricao,
          preco: currentRow.preco,
          categoria: currentRow.categoria,
          quantidade: currentRow.quantidade,
          imagem: currentRow.imagem ?? '',
        }
      : { descricao: '', preco: 0, categoria: '', quantidade: 0, imagem: '' },
  })

  const mutation = useMutation<void, Error, ProdutoForm>({
    mutationFn: async (values) => {
      if (isEdit) {
        await updateProduto(currentRow!.id, {
          ...values,
          id: currentRow!.id,
          imagem: values.imagem ?? '',
        })
      } else {
        await createProduto({ ...values, imagem: values.imagem ?? '' })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      toast.success(isEdit ? 'Produto atualizado!' : 'Produto criado!')
      form.reset()
      onOpenChange(false)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Erro ao salvar produto.')
    },
  })

  const onSubmit = (values: ProdutoForm) => mutation.mutate(values)

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do produto.'
              : 'Preencha os dados do novo produto.'}{' '}
            Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='produto-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 px-0.5 py-1'
          >
            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nome do produto'
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
              control={form.control}
              name='preco'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Preço (R$)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder='0.00'
                      className='col-span-4'
                      {...field}
                      value={field.value as number}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoria'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Categoria
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Selecione'
                    className='col-span-4'
                    items={categorias.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantidade'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Estoque</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='0'
                      placeholder='0'
                      className='col-span-4'
                      {...field}
                      value={field.value as number}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='imagem'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    URL Imagem
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://...'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='submit'
            form='produto-form'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
