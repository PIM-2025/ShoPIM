import { useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Shield,
  Tag,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [showCvv, setShowCvv] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    email: '',
    firstName: '',
    lastName: '',
    phone: '',

    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BR',

    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',

    // Options
    saveInfo: false,
    sameAsBilling: true,
    newsletter: false,
    promoCode: '',
  })

  const [orderSummary] = useState({
    items: [
      {
        id: 1,
        name: 'Fone de Ouvido Sem Fio Premium',
        variant: 'Midnight Black',
        price: 299.99,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60',
      },
      {
        id: 2,
        name: 'Bolsa de Couro para Laptop',
        variant: 'Marrom Escuro',
        price: 89.99,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=60',
      },
    ],
    shipping: 15.99,
    tax: 27.54,
    discount: 0,
    promoDiscount: 0,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value: string) => {
    // Format expiry as MM/YY
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    handleInputChange('expiryDate', formatted)
  }

  const subtotal = orderSummary.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const total =
    subtotal +
    orderSummary.shipping +
    orderSummary.tax -
    orderSummary.discount -
    orderSummary.promoDiscount

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className='bg-muted/30'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-balance'>
            Checkout Seguro
          </h1>
          <p className='text-muted-foreground'>
            Informe seus dados e finalize sua compra seguindo os passos abaixo.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className='mb-8 flex justify-center'>
          <div className='flex items-center space-x-4'>
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className='flex items-center'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    stepNumber <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`mx-4 h-1 w-16 rounded transition-colors ${
                      stepNumber < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-balance'>
                  {step === 1 && 'Informações de Contato'}
                  {step === 2 && 'Endereço de Entrega'}
                  {step === 3 && 'Detalhes do Pagamento'}
                </CardTitle>
                <CardDescription>
                  {step === 1 &&
                    'Nós enviaremos atualizações sobre seu pedido por email.'}
                  {step === 2 && 'Onde devemos enviar seu pedido?'}
                  {step === 3 &&
                    'Suas informações de pagamento são seguras e criptografadas'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='email-kL9x23P'>Endereço de E-mail</Label>
                      <Input
                        id='email-kL9x23P'
                        type='email'
                        placeholder='john@example.com'
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className='mt-2'
                      />
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName-mN7z84Q'>Nome</Label>
                        <Input
                          id='firstName-mN7z84Q'
                          placeholder='John'
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                          }
                          className='mt-2'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName-pL8w45T'>Sobrenome</Label>
                        <Input
                          id='lastName-pL8w45T'
                          placeholder='Doe'
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                          }
                          className='mt-2'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone-rM6n82S'>
                        Número de Telefone (opcional)
                      </Label>
                      <Input
                        id='phone-rM6n82S'
                        type='tel'
                        placeholder='+55 (19) 12345-6789'
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className='mt-2'
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {step === 2 && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='address-qP4z17X'>Endereço</Label>
                      <Input
                        id='address-qP4z17X'
                        placeholder='123 Main Street'
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        className='mt-2'
                      />
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='city-sT5y91B'>Cidade</Label>
                        <Input
                          id='city-sT5y91B'
                          placeholder='Limeira'
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange('city', e.target.value)
                          }
                          className='mt-2'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='state-wX3k85M'>Estado</Label>
                        <Input
                          id='state-wX3k85M'
                          placeholder='SP'
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange('state', e.target.value)
                          }
                          className='mt-2'
                        />
                      </div>
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='zipCode-vZ9q46N'>CEP</Label>
                        <Input
                          id='zipCode-vZ9q46N'
                          placeholder='12345-678'
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange('zipCode', e.target.value)
                          }
                          className='mt-2'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='country-bH7l52P'>País</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleInputChange('country', value)
                          }
                        >
                          <SelectTrigger
                            id='country-bH7l52P'
                            className='mt-2 w-full'
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='BR'>Brasil</SelectItem>
                            <SelectItem value='US'>Estados Unidos</SelectItem>
                            <SelectItem value='CA'>Canadá</SelectItem>
                            <SelectItem value='UK'>Reino Unido</SelectItem>
                            <SelectItem value='AU'>Austrália</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className='space-y-6'>
                    {/* Payment Method */}
                    <div className='space-y-4'>
                      <Label className='text-sm font-medium'>
                        Payment method
                      </Label>
                      <RadioGroup defaultValue='card' className='space-y-3'>
                        <div className='flex items-center space-x-3 rounded-lg border p-4'>
                          <RadioGroupItem
                            value='card'
                            id='card-payment-cN9m74K'
                          />
                          <CreditCard className='size-5 text-muted-foreground' />
                          <Label
                            htmlFor='card-payment-cN9m74K'
                            className='flex-1 cursor-pointer'
                          >
                            Cartão de Crédito
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Card Details */}
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='cardNumber-dK5p83L'>
                          Número do cartão
                        </Label>
                        <Input
                          id='cardNumber-dK5p83L'
                          placeholder='1234 5678 9012 3456'
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleCardNumberChange(e.target.value)
                          }
                          maxLength={19}
                          className='mt-2'
                        />
                      </div>

                      <div className='grid gap-4 md:grid-cols-3'>
                        <div className='space-y-2'>
                          <Label htmlFor='expiryDate-fJ6r29M'>
                            Data de expiração
                          </Label>
                          <Input
                            id='expiryDate-fJ6r29M'
                            placeholder='MM/YY'
                            value={formData.expiryDate}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            maxLength={5}
                            className='mt-2'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='cvv-gH8s34N'>CVV</Label>
                          <div className='relative'>
                            <Input
                              id='cvv-gH8s34N'
                              type={showCvv ? 'text' : 'password'}
                              placeholder='123'
                              value={formData.cvv}
                              onChange={(e) =>
                                handleInputChange('cvv', e.target.value)
                              }
                              maxLength={4}
                              className='mt-2 pe-10'
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='absolute end-0 top-1/2 h-full -translate-y-1/2 cursor-pointer hover:bg-transparent'
                              onClick={() => setShowCvv(!showCvv)}
                            >
                              {showCvv ? (
                                <EyeOff className='size-4 text-muted-foreground' />
                              ) : (
                                <Eye className='size-4 text-muted-foreground' />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='cardName-hI9t45O'>
                            Nome no cartão
                          </Label>
                          <Input
                            id='cardName-hI9t45O'
                            placeholder='John Doe'
                            value={formData.cardName}
                            onChange={(e) =>
                              handleInputChange('cardName', e.target.value)
                            }
                            className='mt-2'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className='space-y-4'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='saveInfo-jK0u56P'
                          checked={formData.saveInfo}
                          onCheckedChange={(checked) =>
                            handleInputChange('saveInfo', checked as boolean)
                          }
                        />
                        <Label htmlFor='saveInfo-jK0u56P' className='text-sm'>
                          Salvar informações de pagamento para compras futuras
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className='flex justify-between pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={prevStep}
                    disabled={step === 1}
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <ArrowLeft className='size-4' />
                    Back
                  </Button>

                  {step < 3 ? (
                    <Button onClick={nextStep} className='cursor-pointer'>
                      Continue
                    </Button>
                  ) : (
                    <Button className='flex cursor-pointer items-center gap-2'>
                      <Lock className='size-4' />
                      Complete Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-8'>
              <CardHeader>
                <CardTitle className='text-balance'>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Items */}
                <div className='space-y-4'>
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className='flex gap-4'>
                      <div className='relative'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-16 w-16 rounded-lg object-cover'
                        />
                        <Badge
                          variant='secondary'
                          className='absolute -end-2 -top-2 size-6 rounded-full p-0 text-xs'
                        >
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h4 className='truncate text-sm font-medium'>
                          {item.name}
                        </h4>
                        <p className='text-xs text-muted-foreground'>
                          {item.variant}
                        </p>
                        <p className='mt-1 text-sm font-medium'>
                          R${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Promo Code */}
                <div className='space-y-2'>
                  <Label htmlFor='promoCode-kL1m67Q' className='text-sm'>
                    Código Promocional
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id='promoCode-kL1m67Q'
                      placeholder='Digite seu código promocional'
                      value={formData.promoCode}
                      onChange={(e) =>
                        handleInputChange('promoCode', e.target.value)
                      }
                    />
                    <Button variant='outline' className='cursor-pointer'>
                      Aplicar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='flex items-center gap-1 text-muted-foreground'>
                      <Truck className='size-3' />
                      Frete
                    </span>
                    <span>R${orderSummary.shipping.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Impostos</span>
                    <span>R${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  {orderSummary.promoDiscount > 0 && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span className='flex items-center gap-1'>
                        <Tag className='size-3' />
                        Desconto
                      </span>
                      <span>-R${orderSummary.promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className='flex justify-between font-semibold'>
                  <span>Total</span>
                  <span>R${total.toFixed(2)}</span>
                </div>

                {/* Trust Indicators */}
                <div className='space-y-3 pt-4'>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Shield className='size-4 text-green-600' />
                    <span>Pagamento com criptografia SSL</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Truck className='size-4 text-blue-600' />
                    <span>Frete grátis em pedidos acima de R$75,00</span>
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
