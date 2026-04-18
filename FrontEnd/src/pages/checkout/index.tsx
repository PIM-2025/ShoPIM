import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Loader2,
  Lock,
  Shield,
  Truck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { criarPedido, getEnderecoUsuario } from '@/service/pedidoService'

export default function Checkout() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { items, setItems } = useCartStore()
  const usuario = auth.user

  const [step, setStep] = useState(1)
  const [showCvv, setShowCvv] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cepLoading, setCepLoading] = useState(false)
  const cepRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    email: usuario?.email ?? '',
    firstName: usuario?.name?.split(' ')[0] ?? '',
    lastName: usuario?.name?.split(' ').slice(1).join(' ') ?? '',
    phone: '',
    rua: '',
    numero: '',
    complemento: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveInfo: false,
  })

  // Pré-carrega endereço existente do usuário; usa CEP do cálculo de frete como fallback
  useEffect(() => {
    const cepFrete = localStorage.getItem('frete_cep') ?? ''

    if (!usuario?.id) {
      if (cepFrete) {
        const formatted = cepFrete.replace(/(\d{5})(\d)/, '$1-$2')
        setFormData((prev) => ({ ...prev, zipCode: formatted }))
      }
      return
    }

    getEnderecoUsuario(usuario.id).then((end) => {
      const cepSalvo = end?.cep ?? ''
      const zipCode = cepSalvo || (cepFrete ? cepFrete.replace(/(\d{5})(\d)/, '$1-$2') : '')
      setFormData((prev) => ({
        ...prev,
        rua: end?.rua ?? '',
        numero: end?.numero ?? '',
        complemento: end?.complemento ?? '',
        city: end?.cidade ?? '',
        state: end?.estado ?? '',
        zipCode,
      }))
    })
  }, [usuario?.id])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    handleInputChange('expiryDate', formatted)
  }

  const handleCepChange = async (value: string) => {
    const digits = value.replace(/\D/g, '')
    const formatted = digits.replace(/(\d{5})(\d)/, '$1-$2')
    handleInputChange('zipCode', formatted)

    if (digits.length === 8) {
      setCepLoading(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            zipCode: formatted,
            rua: data.logradouro ?? prev.rua,
            city: data.localidade ?? prev.city,
            state: data.uf ?? prev.state,
          }))
          setErrors((prev) => ({ ...prev, rua: '', city: '', state: '', zipCode: '' }))
        }
      } catch {
        // ignora erro de rede
      } finally {
        setCepLoading(false)
      }
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.produto.preco * i.quantidade, 0)
  const frete = subtotal >= 75 ? 0 : 15.99
  const total = subtotal + frete

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (s === 1) {
      if (!formData.email.trim()) newErrors.email = 'E-mail obrigatório'
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome obrigatório'
      if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome obrigatório'
    }
    if (s === 2) {
      if (!formData.rua.trim()) newErrors.rua = 'Rua obrigatória'
      if (!formData.numero.trim()) newErrors.numero = 'Número obrigatório'
      if (!formData.city.trim()) newErrors.city = 'Cidade obrigatória'
      if (!formData.state.trim()) newErrors.state = 'Estado obrigatório'
      if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP obrigatório'
    }
    if (s === 3) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão obrigatório'
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Validade obrigatória'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV obrigatório'
      if (!formData.cardName.trim()) newErrors.cardName = 'Nome no cartão obrigatório'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) setStep((p) => Math.min(p + 1, 3))
  }
  const prevStep = () => {
    setErrors({})
    setStep((p) => Math.max(p - 1, 1))
  }

  const handleFinalizar = async () => {
    if (!validateStep(3)) return
    if (!usuario?.id) return
    setSubmitting(true)
    try {
      const result = await criarPedido({
        idUsuario: usuario.id,
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento || undefined,
        cidade: formData.city,
        estado: formData.state,
        cep: formData.zipCode,
      })
      setItems([])
      navigate({ to: '/pedido/$id', params: { id: String(result.id) } })
    } catch (e) {
      console.error('Erro ao finalizar pedido', e)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
        <p className='text-lg font-medium'>Seu carrinho está vazio.</p>
        <Button onClick={() => navigate({ to: '/' })}>Continuar comprando</Button>
      </div>
    )
  }

  return (
    <div className='bg-muted/30 min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold'>Checkout Seguro</h1>
          <p className='text-muted-foreground'>Informe seus dados e finalize sua compra.</p>
        </div>

        {/* Progress */}
        <div className='mb-8 flex justify-center'>
          <div className='flex items-center space-x-4'>
            {[
              { n: 1, label: 'Contato' },
              { n: 2, label: 'Entrega' },
              { n: 3, label: 'Pagamento' },
            ].map(({ n, label }) => (
              <div key={n} className='flex items-center'>
                <div className='flex flex-col items-center gap-1'>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    n <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>{n}</div>
                  <span className='text-xs text-muted-foreground'>{label}</span>
                </div>
                {n < 3 && <div className={`mx-4 mb-5 h-1 w-16 rounded transition-colors ${n < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Formulário */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && 'Informações de Contato'}
                  {step === 2 && 'Endereço de Entrega'}
                  {step === 3 && 'Pagamento'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Confirme seus dados de contato.'}
                  {step === 2 && 'Onde devemos enviar seu pedido?'}
                  {step === 3 && 'Suas informações são seguras e criptografadas.'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>

                {/* Step 1 */}
                {step === 1 && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>E-mail <span className='text-destructive'>*</span></Label>
                      <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                      {errors.email && <p className='text-xs text-destructive'>{errors.email}</p>}
                    </div>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label>Nome <span className='text-destructive'>*</span></Label>
                        <Input value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={errors.firstName ? 'border-destructive' : ''} />
                        {errors.firstName && <p className='text-xs text-destructive'>{errors.firstName}</p>}
                      </div>
                      <div className='space-y-2'>
                        <Label>Sobrenome <span className='text-destructive'>*</span></Label>
                        <Input value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={errors.lastName ? 'border-destructive' : ''} />
                        {errors.lastName && <p className='text-xs text-destructive'>{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Telefone (opcional)</Label>
                      <Input type='tel' placeholder='+55 (19) 99999-9999' value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label>CEP <span className='text-destructive'>*</span></Label>
                      <div className='relative'>
                        <Input
                          ref={cepRef}
                          placeholder='00000-000'
                          value={formData.zipCode}
                          onChange={(e) => handleCepChange(e.target.value)}
                          maxLength={9}
                          className={errors.zipCode ? 'border-destructive' : ''}
                        />
                        {cepLoading && (
                          <Loader2 className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground' />
                        )}
                      </div>
                      {errors.zipCode && <p className='text-xs text-destructive'>{errors.zipCode}</p>}
                    </div>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <div className='space-y-2 md:col-span-2'>
                        <Label>Rua <span className='text-destructive'>*</span></Label>
                        <Input placeholder='Nome da rua / avenida' value={formData.rua} onChange={(e) => handleInputChange('rua', e.target.value)} className={errors.rua ? 'border-destructive' : ''} />
                        {errors.rua && <p className='text-xs text-destructive'>{errors.rua}</p>}
                      </div>
                      <div className='space-y-2'>
                        <Label>Número <span className='text-destructive'>*</span></Label>
                        <Input placeholder='123' value={formData.numero} onChange={(e) => handleInputChange('numero', e.target.value)} className={errors.numero ? 'border-destructive' : ''} />
                        {errors.numero && <p className='text-xs text-destructive'>{errors.numero}</p>}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Complemento</Label>
                      <Input placeholder='Apto, bloco, casa...' value={formData.complemento} onChange={(e) => handleInputChange('complemento', e.target.value)} />
                    </div>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label>Cidade <span className='text-destructive'>*</span></Label>
                        <Input placeholder='Limeira' value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className={errors.city ? 'border-destructive' : ''} />
                        {errors.city && <p className='text-xs text-destructive'>{errors.city}</p>}
                      </div>
                      <div className='space-y-2'>
                        <Label>Estado <span className='text-destructive'>*</span></Label>
                        <Input placeholder='SP' maxLength={2} value={formData.state} onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())} className={errors.state ? 'border-destructive' : ''} />
                        {errors.state && <p className='text-xs text-destructive'>{errors.state}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className='space-y-6'>
                    <RadioGroup defaultValue='card' className='space-y-3'>
                      <div className='flex items-center space-x-3 rounded-lg border p-4'>
                        <RadioGroupItem value='card' id='card' />
                        <CreditCard className='size-5 text-muted-foreground' />
                        <Label htmlFor='card' className='flex-1 cursor-pointer'>Cartão de Crédito</Label>
                      </div>
                    </RadioGroup>

                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label>Número do cartão <span className='text-destructive'>*</span></Label>
                        <Input placeholder='1234 5678 9012 3456' value={formData.cardNumber} onChange={(e) => handleCardNumberChange(e.target.value)} maxLength={19} className={errors.cardNumber ? 'border-destructive' : ''} />
                        {errors.cardNumber && <p className='text-xs text-destructive'>{errors.cardNumber}</p>}
                      </div>
                      <div className='grid gap-4 md:grid-cols-3'>
                        <div className='space-y-2'>
                          <Label>Validade <span className='text-destructive'>*</span></Label>
                          <Input placeholder='MM/AA' value={formData.expiryDate} onChange={(e) => handleExpiryChange(e.target.value)} maxLength={5} className={errors.expiryDate ? 'border-destructive' : ''} />
                          {errors.expiryDate && <p className='text-xs text-destructive'>{errors.expiryDate}</p>}
                        </div>
                        <div className='space-y-2'>
                          <Label>CVV <span className='text-destructive'>*</span></Label>
                          <div className='relative'>
                            <Input type={showCvv ? 'text' : 'password'} placeholder='123' value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)} maxLength={4} className={`pe-10${errors.cvv ? ' border-destructive' : ''}`} />
                            <Button type='button' variant='ghost' size='icon' className='absolute end-0 top-0 h-full hover:bg-transparent' onClick={() => setShowCvv(!showCvv)}>
                              {showCvv ? <EyeOff className='size-4 text-muted-foreground' /> : <Eye className='size-4 text-muted-foreground' />}
                            </Button>
                          </div>
                          {errors.cvv && <p className='text-xs text-destructive'>{errors.cvv}</p>}
                        </div>
                        <div className='space-y-2'>
                          <Label>Nome no cartão <span className='text-destructive'>*</span></Label>
                          <Input placeholder='JEAN F CAMPOS' value={formData.cardName} onChange={(e) => handleInputChange('cardName', e.target.value)} className={errors.cardName ? 'border-destructive' : ''} />
                          {errors.cardName && <p className='text-xs text-destructive'>{errors.cardName}</p>}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Checkbox id='saveInfo' checked={formData.saveInfo} onCheckedChange={(v) => handleInputChange('saveInfo', v as boolean)} />
                      <Label htmlFor='saveInfo' className='text-sm'>Salvar dados para próximas compras</Label>
                    </div>
                  </div>
                )}

                <div className='flex justify-between pt-4'>
                  <Button variant='outline' onClick={prevStep} disabled={step === 1} className='gap-2'>
                    <ArrowLeft className='size-4' /> Voltar
                  </Button>
                  {step < 3 ? (
                    <Button onClick={nextStep}>Continuar</Button>
                  ) : (
                    <Button onClick={handleFinalizar} disabled={submitting} className='gap-2'>
                      {submitting ? <Loader2 className='size-4 animate-spin' /> : <Lock className='size-4' />}
                      {submitting ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-8'>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  {items.map((item) => (
                    <div key={item.id} className='flex gap-3'>
                      <div className='relative shrink-0'>
                        {item.produto.imagem ? (
                          <img src={item.produto.imagem} alt={item.produto.descricao} className='h-16 w-16 rounded-lg object-cover' />
                        ) : (
                          <div className='h-16 w-16 rounded-lg bg-muted' />
                        )}
                        <Badge variant='secondary' className='absolute -end-2 -top-2 size-6 rounded-full p-0 text-xs'>
                          {item.quantidade}
                        </Badge>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>{item.produto.descricao}</p>
                        <p className='text-xs text-muted-foreground'>{item.produto.categoria}</p>
                        <p className='mt-1 text-sm font-medium'>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='flex items-center gap-1 text-muted-foreground'><Truck className='size-3' /> Frete</span>
                    <span>{frete === 0 ? <span className='text-green-600'>Grátis</span> : `R$ ${frete.toFixed(2)}`}</span>
                  </div>
                </div>

                <Separator />

                <div className='flex justify-between font-semibold'>
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>

                <div className='space-y-2 pt-2'>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Shield className='size-4 text-green-600' />
                    <span>Pagamento com criptografia SSL</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Truck className='size-4 text-blue-600' />
                    <span>Frete grátis em pedidos acima de R$ 75,00</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Gift className='size-4 text-purple-600' />
                    <span>Política de devolução de 30 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
