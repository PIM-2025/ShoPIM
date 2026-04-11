import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { getConfiguracao, salvarConfiguracao, type Configuracao } from '@/service/configuracaoService'
import { ContentSection } from '../components/content-section'

type FormValues = Omit<Configuracao, 'id'>

function EstabelecimentoForm() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['configuracao'],
    queryFn: getConfiguracao,
  })

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>()

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: salvarConfiguracao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracao'] })
    },
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-10'>
        <Loader2 className='size-5 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} className='space-y-8'>

      {/* Identidade */}
      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-semibold'>Identidade</h4>
          <p className='text-xs text-muted-foreground'>Nome e logo exibidos no painel.</p>
        </div>
        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <Label>Nome da Loja</Label>
            <Input placeholder='Ex: ShoPIM Store' {...register('nome')} />
          </div>
          <div className='space-y-1.5'>
            <Label>Descrição</Label>
            <Textarea
              placeholder='Uma breve descrição do seu negócio...'
              className='resize-none'
              rows={3}
              {...register('descricao')}
            />
          </div>
          <div className='space-y-1.5'>
            <Label>URL do Logo</Label>
            <Input placeholder='https://...' {...register('logoUrl')} />
            <p className='text-xs text-muted-foreground'>URL de uma imagem hospedada (PNG, SVG ou JPG).</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contato */}
      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-semibold'>Contato</h4>
          <p className='text-xs text-muted-foreground'>Exibido no site e nas comunicações com clientes.</p>
        </div>
        <div className='space-y-3'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label>E-mail</Label>
              <Input type='email' placeholder='contato@loja.com' {...register('email')} />
            </div>
            <div className='space-y-1.5'>
              <Label>Telefone</Label>
              <Input placeholder='(19) 3333-4444' {...register('telefone')} />
            </div>
          </div>
          <div className='space-y-1.5'>
            <Label>WhatsApp</Label>
            <Input placeholder='(19) 99999-9999' {...register('whatsapp')} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Frete */}
      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-semibold'>Frete</h4>
          <p className='text-xs text-muted-foreground'>Valor mínimo para frete grátis.</p>
        </div>
        <div className='space-y-1.5'>
          <Label>Frete grátis acima de (R$)</Label>
          <Input
            type='number'
            step='0.01'
            min='0'
            placeholder='75.00'
            className='max-w-xs'
            {...register('freteGratisAcima', { valueAsNumber: true })}
          />
          <p className='text-xs text-muted-foreground'>Deixe em branco para desativar.</p>
        </div>
      </div>

      <Button type='submit' disabled={!isDirty || isPending}>
        {isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
        Salvar alterações
      </Button>
    </form>
  )
}

export function EstabelecimentoSettings() {
  return (
    <ContentSection
      title='Estabelecimento'
      desc='Configure as informações da sua loja.'
    >
      <EstabelecimentoForm />
    </ContentSection>
  )
}
