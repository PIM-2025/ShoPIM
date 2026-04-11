import { Laptop, Shirt, Watch } from 'lucide-react'

export const categorias = [
  { label: 'Eletrônicos', value: 'eletronicos', icon: Laptop },
  { label: 'Roupas', value: 'roupas', icon: Shirt },
  { label: 'Acessórios', value: 'acessorios', icon: Watch },
] as const
