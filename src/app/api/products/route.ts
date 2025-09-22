import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    include: { variants: { include: { images: true, stocks: true } } },
    take: 100,
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}
