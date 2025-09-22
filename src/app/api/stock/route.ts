import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emitStockUpdate, emitStockCreate, emitStockDelete } from '@/lib/bus'

export async function PATCH(request: NextRequest) {
  try {
    const { stockId, quantity } = await request.json()

    const stock = await prisma.stock.update({
      where: { id: stockId },
      data: { quantity }
    })

    emitStockUpdate(stock.id, stock.quantity)
    return NextResponse.json(stock)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { variantId, sizeId, quantity } = await request.json()
    if (!variantId || !sizeId) return NextResponse.json({ error: 'variantId et sizeId requis' }, { status: 400 })

    const created = await prisma.stock.create({
      data: { variantId, sizeId, quantity: typeof quantity === 'number' && quantity >= 0 ? quantity : 0 }
    })

    emitStockCreate(created.id)
    emitStockUpdate(created.id, created.quantity)
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Stock déjà existant pour cette variante et taille' }, { status: 409 })
    }
    console.error('Erreur lors de la création du stock:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    const deleted = await prisma.stock.delete({ where: { id } })
    emitStockDelete(deleted.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du stock:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}