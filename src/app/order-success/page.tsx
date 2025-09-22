'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function OrderSuccessInner() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-green-600 mb-2">Commande confirmée !</h1>
        <p className="text-gray-600">
          Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mt-2">
            Numéro de commande: #{orderId.slice(-8)}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded font-medium"
        >
          Continuer vos achats
        </Link>
        <div>
          <Link
            href="/admin/orders"
            className="text-blue-500 hover:underline"
          >
            Voir les commandes (admin)
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto text-center py-8">Chargement…</div>}>
      <OrderSuccessInner />
    </Suspense>
  )
}
