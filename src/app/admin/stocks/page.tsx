import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import StocksClient from './StocksClient'

export default async function AdminStocksPage() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role
  if (!session || (role !== 'ADMIN' && role !== 'SELLER')) {
    redirect('/')
  }
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Gestion des stocks</h1>
      <StocksClient />
    </div>
  )
}
