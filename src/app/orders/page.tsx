import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Mes commandes</h1>
        <p className="text-slate-600 mb-6">Veuillez vous connecter pour voir vos commandes.</p>
        <Link href="/api/auth/signin" className="px-4 py-2 rounded bg-slate-900 text-white">Se connecter</Link>
      </div>
    )
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Mes commandes</h1>
        <p className="text-slate-600">Compte introuvable.</p>
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
          size: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded">
          <p className="text-slate-600 mb-4">Aucune commande pour l’instant.</p>
          <Link href="/" className="px-4 py-2 rounded bg-slate-900 text-white">Commencer mes achats</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Commande #{o.id.slice(-8)}</div>
                  <div className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
                      : o.status === 'PAID' ? 'bg-green-100 text-green-800'
                      : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800'
                      : o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>{o.status}</span>
                  </div>
                  <div className="mt-1 font-semibold">{o.total.toFixed(2)} EUR</div>
                </div>
              </div>
              <div className="mt-4">
                <ol className="flex items-center text-xs text-slate-600 gap-2">
                  {['PENDING','PAID','SHIPPED','DELIVERED'].map((st) => (
                    <li key={st} className={`flex-1 flex items-center gap-2 ${st === o.status ? 'font-semibold text-slate-900' : ''}`}>
                      <span className={`w-2 h-2 rounded-full ${
                        st === 'PENDING' ? 'bg-yellow-500' : st === 'PAID' ? 'bg-green-500' : st === 'SHIPPED' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></span>
                      <span>{st}</span>
                      {st !== 'DELIVERED' && <span className="flex-1 h-px bg-slate-200"></span>}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between py-1">
                    <div>
                      {it.variant.product.brand} {it.variant.product.name} · {it.variant.colorName} · Taille {it.size.label}
                    </div>
                    <div>x{it.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`/orders/${o.id}/invoice?print=1`}
                  target="_blank"
                  className="inline-block px-3 py-2 rounded border text-sm"
                >Télécharger la facture</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


