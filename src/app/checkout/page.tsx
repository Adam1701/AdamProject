'use client'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('Veuillez vous connecter pour commander')
      return
    }

    setLoading(true)
    try {
      const checkoutItems = items.map(item => ({
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        price: item.product.price
      }))

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutItems)
      })

      if (res.ok) {
        const { orderId } = await res.json()
        clearCart()
        router.push(`/order-success?orderId=${orderId}`)
      } else {
        const error = await res.text()
        alert(`Erreur: ${error}`)
      }
    } catch (e) {
      alert('Erreur lors de la commande')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold mb-4">Votre panier est vide</h1>
        <button onClick={() => router.push('/')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Continuer vos achats
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Finaliser la commande</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-medium">Informations de livraison</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Nom"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            required
          />
          
          <input
            type="text"
            placeholder="Adresse"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Code postal"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          
          <input
            type="text"
            placeholder="Pays"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            required
          />

          <h2 className="text-lg font-medium mt-6">Paiement (simulation)</h2>
          <div className="border rounded p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Mode de paiement simulé</p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="payment" value="card" defaultChecked className="mr-2" />
                Carte bancaire (simulation)
              </label>
              <label className="flex items-center">
                <input type="radio" name="payment" value="paypal" className="mr-2" />
                PayPal (simulation)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} EUR`}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-medium mb-4">Résumé de la commande</h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.brand} {item.product.name} x{item.quantity}</span>
                <span>{item.product.price * item.quantity} EUR</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{total.toFixed(2)} EUR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
