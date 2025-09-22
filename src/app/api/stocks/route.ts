import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const category = searchParams.get('category') as 'men'|'women'|'kids'|null
    const minQty = searchParams.get('minQty')
    const maxQty = searchParams.get('maxQty')

    const stocks = await prisma.stock.findMany({
      include: {
        variant: {
          include: {
            product: true
          }
        },
        size: true
      },
      where: {
        ...(category ? { size: { category } } : {}),
        ...(minQty ? { quantity: { gte: parseInt(minQty, 10) || 0 } } : {}),
        ...(maxQty ? { quantity: { lte: parseInt(maxQty, 10) || 0 } } : {}),
        ...(q
          ? {
              OR: [
                { size: { label: { contains: q, mode: 'insensitive' } } },
                { variant: { colorName: { contains: q, mode: 'insensitive' } } },
                { variant: { product: { name: { contains: q, mode: 'insensitive' } } } },
                { variant: { product: { brand: { contains: q, mode: 'insensitive' } } } },
              ],
            }
          : {}),
      },
      orderBy: {
        variant: {
          product: {
            name: 'asc'
          }
        }
      }
    })

    return NextResponse.json(stocks)
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}