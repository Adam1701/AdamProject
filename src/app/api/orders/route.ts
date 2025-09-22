import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            },
            size: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    // Email simulé
    try {
      const full = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true }
      })
      if (full?.user?.email) {
        console.log('[EMAIL_SIMULATION] Mise à jour commande', orderId, '=>', status, 'envoyée à', full.user.email)
      }
    } catch {}

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
