'use client'
import { useCart } from '@/components/cart/CartProvider'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold mb-4">Votre panier est vide</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Continuer vos achats
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Votre panier</h1>
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border rounded p-4">
            <div className="w-20 h-20 relative">
              <Image
                src={item.variant.images[0]?.url || '/placeholder.jpg'}
                alt={item.product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.brand} {item.product.name}</h3>
              <p className="text-sm text-gray-600">{item.variant.colorName} - {item.size.label}</p>
              <p className="text-sm text-gray-600">{item.product.price} {item.product.currency}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="font-medium">{item.product.price * item.quantity} {item.product.currency}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total: {total.toFixed(2)} EUR</span>
          <Link
            href="/checkout"
            className="bg-green-500 text-white px-6 py-2 rounded font-medium"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  )
}
