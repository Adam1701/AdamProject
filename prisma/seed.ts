import { PrismaClient, Category, Role } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.resolve(process.env.HOME || '', 'projects/shoe-scraper/data/products.json')
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const products: Array<{
    product_id: string
    name: string
    brand: string
    category: 'men' | 'women' | 'kids'
    product_url?: string
    price?: number
    currency: string
    variants: Array<{
      color_name: string
      image_urls: string[]
      sizes: string[]
      stock_by_size: Record<string, number>
    }>
  }> = JSON.parse(raw)

  // Seed base users
  const adminPass = await bcrypt.hash('admin123', 10)
  const sellerPass = await bcrypt.hash('seller123', 10)
  const customerPass = await bcrypt.hash('customer123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash: adminPass, role: 'ADMIN', name: 'Admin' }
  })
  await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { email: 'seller@example.com', passwordHash: sellerPass, role: 'SELLER', name: 'Seller' }
  })
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { email: 'customer@example.com', passwordHash: customerPass, role: 'CUSTOMER', name: 'Customer' }
  })

  // Seed sizes per category
  const uniqueSizesByCat: Record<'men'|'women'|'kids', Set<string>> = { men: new Set(), women: new Set(), kids: new Set() }
  for (const p of products) {
    for (const v of p.variants) {
      v.sizes.forEach(s => uniqueSizesByCat[p.category].add(s))
    }
  }

  const sizeIdByCatLabel: Record<string, string> = {}
  for (const cat of ['men','women','kids'] as const) {
    for (const label of Array.from(uniqueSizesByCat[cat])) {
      const size = await prisma.size.upsert({
        where: { label_category: { label, category: cat as Category } },
        update: {},
        create: { label, category: cat as Category }
      })
      sizeIdByCatLabel[`${cat}:${label}`] = size.id
    }
  }

  // Insert products
  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        externalId: p.product_id,
        name: p.name,
        brand: p.brand,
        category: p.category as Category,
        productUrl: p.product_url ?? null,
        price: p.price ?? null,
        currency: p.currency,
        variants: {
          create: p.variants.map(v => ({
            colorName: v.color_name,
            images: { create: v.image_urls.slice(0,6).map((url, idx) => ({ url, sort: idx })) },
            stocks: { create: v.sizes.map(label => ({
              sizeId: sizeIdByCatLabel[`${p.category}:${label}`],
              quantity: v.stock_by_size[label] ?? 0,
            })) }
          }))
        }
      }
    })
  }

  console.log(`Seeded ${products.length} products.`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
