'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type CartItem = {
  id: string
  variantId: string
  sizeId: string
  quantity: number
  product: {
    name: string
    brand: string
    price: number
    currency: string
  }
  variant: {
    colorName: string
    images: Array<{ url: string }>
  }
  size: {
    label: string
  }
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === item.variantId && i.sizeId === item.sizeId)
      if (existing) {
        return prev.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, { ...item, id: `${item.variantId}-${item.sizeId}` }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
