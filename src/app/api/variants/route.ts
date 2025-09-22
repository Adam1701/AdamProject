import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const take = Math.min(parseInt(searchParams.get('take') || '50', 10) || 50, 100)

    const variants = await prisma.variant.findMany({
      where: q
        ? {
            OR: [
              { colorName: { contains: q } },
              { product: { name: { contains: q } } },
              { product: { brand: { contains: q } } },
            ],
          }
        : undefined,
      include: { product: true },
      take,
      orderBy: { product: { name: 'asc' } },
    })

    return NextResponse.json(
      variants.map((v) => ({ id: v.id, label: `${v.product.brand} ${v.product.name} · ${v.colorName}` }))
    )
  } catch (error) {
    console.error('Erreur /api/variants', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


