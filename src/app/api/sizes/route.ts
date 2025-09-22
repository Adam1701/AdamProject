import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const cat = searchParams.get('category') as 'men' | 'women' | 'kids' | null
    const take = Math.min(parseInt(searchParams.get('take') || '100', 10) || 100, 200)

    const sizes = await prisma.size.findMany({
      where: {
        ...(q ? { label: { contains: q } } : {}),
        ...(cat ? { category: cat } : {}),
      },
      take,
      orderBy: [{ category: 'asc' }, { label: 'asc' }],
    })

    return NextResponse.json(sizes.map((s) => ({ id: s.id, label: `${s.label} (${s.category})` })))
  } catch (error) {
    console.error('Erreur /api/sizes', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


