import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const items = (await req.json()) as Array<{ variantId: string; sizeId: string; quantity: number; price: number }>
  if (!Array.isArray(items) || items.length === 0) return new NextResponse('Bad Request', { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const result = await prisma.$transaction(async (tx) => {
      for (const it of items) {
        const stock = await tx.stock.findUnique({ where: { variantId_sizeId: { variantId: it.variantId, sizeId: it.sizeId } } })
        if (!stock || stock.quantity < it.quantity) {
          throw new Error('Insufficient stock')
        }
        await tx.stock.update({ where: { id: stock.id }, data: { quantity: stock.quantity - it.quantity } })
      }
      const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
      const order = await tx.order.create({ data: { userId: user.id, total, status: 'PAID' } })
      for (const it of items) {
        await tx.orderItem.create({ data: { orderId: order.id, variantId: it.variantId, sizeId: it.sizeId, unitPrice: it.price, quantity: it.quantity } })
      }
      return order
    })
    // Simulation d'email de confirmation
    console.log('[EMAIL_SIMULATION] Confirmation envoyée à', session.user.email, 'pour la commande', result.id)
    return NextResponse.json({ orderId: result.id })
  } catch (e) {
    return new NextResponse('Conflict', { status: 409 })
  }
}
