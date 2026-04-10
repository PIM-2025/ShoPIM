import { create } from 'zustand'
import { CartItem } from '@/service/cartservice'

interface CartStore {
  items: CartItem[]
  loading: boolean
  setItems: (items: CartItem[]) => void
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  loading: true,
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
}))
