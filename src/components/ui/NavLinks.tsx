'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function NavLinks() {
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <div className="flex items-center gap-8">
      <Link href="/" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
        Boutique
      </Link>
      <Link href="/cart" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
        Panier
      </Link>

      {role && (
        <>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium uppercase tracking-wide">
            {role}
          </span>
          <div className="h-6 w-px bg-slate-300" />
        </>
      )}

      {(role === 'ADMIN' || role === 'SELLER') && (
        <>
          <Link href="/admin/stocks" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
            Stocks
          </Link>
          <Link href="/admin/orders" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
            Commandes
          </Link>
        </>
      )}

      {role === 'CUSTOMER' && (
        <Link href="/orders" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
          Mes commandes
        </Link>
      )}

      {session ? (
        <Link href="/api/auth/signout" className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-900 text-sm font-medium hover:bg-slate-300">
          Déconnexion
        </Link>
      ) : (
        <Link href="/api/auth/signin" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
          Connexion
        </Link>
      )}
    </div>
  )
}


