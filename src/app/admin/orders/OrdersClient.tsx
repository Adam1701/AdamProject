'use client'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  user: {
    email: string
  }
  items: {
    id: string
    quantity: number
    variant: {
      colorName: string
      product: {
        name: string
        brand: string
      }
    }
    size: {
      value: string
    }
  }[]
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      })
      
      if (res.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status }
            : order
        ))
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des commandes...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-8)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.items.length} article(s)
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.slice(0, 2).map(item => 
                      `${item.variant.product.brand} ${item.variant.product.name}`
                    ).join(', ')}
                    {order.items.length > 2 && '...'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total.toFixed(2)} EUR
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="PAID">Payée</option>
                    <option value="SHIPPED">Expédiée</option>
                    <option value="DELIVERED">Livrée</option>
                    <option value="CANCELLED">Annulée</option>
                  </select>
                  <a
                    href={`/orders/${order.id}/invoice?print=1`}
                    target="_blank"
                    className="inline-block ml-3 text-sm text-blue-600 hover:underline"
                  >Télécharger la facture</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
