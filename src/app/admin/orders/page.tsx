import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'ADMIN' && role !== 'SELLER')) {
    redirect('/')
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Gestion des commandes</h1>
      <OrdersClient />
    </div>
  )
}
