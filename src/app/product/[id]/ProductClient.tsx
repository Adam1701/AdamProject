'use client'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import ProductImage from '@/components/ui/ProductImage'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number | null
  currency: string
  variants: Array<{
    id: string
    colorName: string
    images: Array<{ url: string }>
    stocks: Array<{
      id: string
      quantity: number
      size: { id: string; label: string }
    }>
  }>
}

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const availableSizes = selectedVariant?.stocks.filter(s => s.quantity > 0) || []

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedSize) return

    const stock = selectedVariant.stocks.find(s => s.size.id === selectedSize)
    if (!stock) return

    addItem({
      variantId: selectedVariant.id,
      sizeId: selectedSize,
      quantity,
      product: {
        name: product.name,
        brand: product.brand,
        price: product.price || 0,
        currency: product.currency
      },
      variant: {
        colorName: selectedVariant.colorName,
        images: selectedVariant.images
      },
      size: {
        label: stock.size.label
      }
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="aspect-square relative">
        <ProductImage
          src={selectedVariant?.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="text-gray-600">{product.brand} • {product.category}</div>
        <div className="text-xl font-medium mt-2">
          {product.price} {product.currency}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Couleur</h3>
            <div className="flex gap-2">
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant)
                    setSelectedSize('')
                  }}
                  className={`px-3 py-1 rounded border ${
                    selectedVariant?.id === variant.id 
                      ? 'border-slate-900 bg-slate-100 text-slate-900' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {variant.colorName}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Taille</h3>
            <div className="flex gap-2">
              {availableSizes.map(stock => (
                <button
                  key={stock.size.id}
                  onClick={() => setSelectedSize(stock.size.id)}
                  className={`px-3 py-1 rounded border ${
                    selectedSize === stock.size.id 
                      ? 'border-slate-900 bg-slate-100 text-slate-900' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {stock.size.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quantité</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !selectedSize}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  )
}
