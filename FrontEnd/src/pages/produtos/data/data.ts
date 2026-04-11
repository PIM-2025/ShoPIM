import { Laptop, Shirt, Watch, Tag, Sparkles } from 'lucide-react'

export const categorias = [
  { label: 'Eletrônicos', value: 'eletronicos', icon: Laptop },
  { label: 'Roupas', value: 'roupas', icon: Shirt },
  { label: 'Acessórios', value: 'acessorios', icon: Watch },
  { label: 'Ofertas', value: 'ofertas', icon: Tag },
  { label: 'Novidades', value: 'novidades', icon: Sparkles },
] as const
