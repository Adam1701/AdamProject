const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// URLs d'images de chaussures spécifiques d'Unsplash
const shoeImageUrls = [
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', // Nike Air Max
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80', // Adidas Stan Smith
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Converse Chuck Taylor
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Nike Air Jordan
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', // Vans Old Skool
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', // Puma Suede
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80', // New Balance 574
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Converse All Star
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', // Nike Dunk
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80', // Adidas Ultraboost
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Vans Authentic
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Nike Blazer
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', // Vans Sk8-Hi
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', // Puma RS-X
  'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80', // New Balance 990
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Converse One Star
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', // Nike React
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80', // Adidas NMD
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Vans Era
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Nike Air Force 1
]

async function fixImages() {
  try {
    console.log('Fixing product images...')
    
    // Récupérer tous les variants avec leurs images
    const variants = await prisma.variant.findMany({
      include: { images: true, product: true }
    })
    
    console.log(`Found ${variants.length} variants to update`)
    
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      
      // Supprimer les anciennes images
      await prisma.image.deleteMany({
        where: { variantId: variant.id }
      })
      
      // Ajouter de nouvelles images de chaussures
      const imageUrls = shoeImageUrls.slice(0, 3) // 3 images par variant
      
      for (let j = 0; j < imageUrls.length; j++) {
        await prisma.image.create({
          data: {
            url: imageUrls[j],
            sort: j,
            variantId: variant.id
          }
        })
      }
      
      console.log(`Updated variant ${i + 1}/${variants.length}: ${variant.product.brand} ${variant.product.name} - ${variant.colorName}`)
    }
    
    console.log('✅ All product images have been updated with shoe images!')
    
  } catch (error) {
    console.error('Error fixing images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImages()
