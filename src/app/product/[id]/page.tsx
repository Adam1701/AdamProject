import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ 
    where: { id }, 
    include: { 
      variants: { 
        include: { 
          images: true, 
          stocks: { include: { size: true } } 
        } 
      } 
    } 
  })
  if (!product) return notFound()
  
  return <ProductClient product={product} />
}
