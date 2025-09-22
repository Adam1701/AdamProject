const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b'
const API_HOST = 'kickscrew-sneakers-data.p.rapidapi.com'

// Marques à récupérer
const brands = ['nike', 'adidas', 'jordan', 'new-balance', 'puma', 'converse', 'vans']

async function fetchProductsFromAPI(brand, limit = 50) {
  try {
    const response = await fetch(`https://${API_HOST}/product/bycollection/v2?collection=${brand}&limit=${limit}`, {
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data?.products || []
  } catch (error) {
    console.error(`Erreur lors de la récupération des données ${brand}:`, error)
    return []
  }
}

function mapGender(gender) {
  switch (gender) {
    case 'MENS': return 'MEN'
    case 'WOMENS': return 'WOMEN'
    case 'KIDS': return 'KIDS'
    default: return 'UNISEX'
  }
}

function mapCategory(gender) {
  switch (gender) {
    case 'MENS': return 'men'
    case 'WOMENS': return 'women'
    case 'KIDS': return 'kids'
    default: return 'men'
  }
}

function generateSizes(gender) {
  const sizeCategories = {
    'men': ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'],
    'women': ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
    'kids': ['3Y', '3.5Y', '4Y', '4.5Y', '5Y', '5.5Y', '6Y', '6.5Y', '7Y', '7.5Y', '8Y', '8.5Y', '9Y', '10Y']
  }
  
  return sizeCategories[gender] || sizeCategories['men']
}

async function updateDatabase() {
  try {
    console.log('🔄 Suppression des données existantes...')
    
    // Supprimer toutes les données existantes
    await prisma.stock.deleteMany()
    await prisma.image.deleteMany()
    await prisma.variant.deleteMany()
    await prisma.product.deleteMany()
    
    console.log('✅ Données existantes supprimées')
    
    let totalProducts = 0
    let totalVariants = 0
    let totalStocks = 0
    
    for (const brand of brands) {
      console.log(`\n📦 Récupération des données ${brand.toUpperCase()}...`)
      
      const products = await fetchProductsFromAPI(brand, 30)
      
      if (products.length === 0) {
        console.log(`⚠️  Aucun produit trouvé pour ${brand}`)
        continue
      }
      
      console.log(`✅ ${products.length} produits trouvés pour ${brand}`)
      
      for (const productData of products) {
        // Filtrer seulement les sneakers
        if (productData.product_type !== 'Sneakers') {
          continue
        }
        
        try {
          // Créer le produit
          const product = await prisma.product.create({
            data: {
              id: `real_${productData.product_id}`,
              name: productData.title.replace(/\([^)]*\)/g, '').trim(), // Supprimer les préfixes (WMNS), (GS), etc.
              brand: productData.brand,
              category: mapCategory(productData.gender),
              price: Math.round(productData.lowest_price * 0.85), // Prix en EUR (approximatif)
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          
          totalProducts++
          
          // Créer la variante (couleur)
          const variant = await prisma.variant.create({
            data: {
              id: `real_variant_${productData.product_id}`,
              productId: product.id,
              colorName: productData.nickname || productData.main_color || 'Standard',
              sku: productData.model_no || productData.modelno || `SKU_${productData.product_id}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          
          totalVariants++
          
          // Créer les images
          if (productData.image) {
            await prisma.image.create({
              data: {
                id: `real_img_${productData.product_id}_1`,
                variantId: variant.id,
                url: productData.image,
                sort: 0
              }
            })
          }
          
          // Créer les tailles et stocks
          const sizes = generateSizes(mapCategory(productData.gender))
          
          for (const sizeValue of sizes) {
            // Créer la taille
            const size = await prisma.size.create({
              data: {
                id: `real_size_${productData.product_id}_${sizeValue}`,
                label: sizeValue,
                category: mapCategory(productData.gender)
              }
            })
            
            // Créer le stock
            const stock = await prisma.stock.create({
              data: {
                id: `real_stock_${productData.product_id}_${sizeValue}`,
                variantId: variant.id,
                sizeId: size.id,
                quantity: Math.floor(Math.random() * 20) + 1 // Stock aléatoire entre 1 et 20
              }
            })
            
            totalStocks++
          }
          
        } catch (error) {
          console.error(`Erreur lors de la création du produit ${productData.product_id}:`, error.message)
        }
      }
    }
    
    console.log(`\n🎉 Mise à jour terminée !`)
    console.log(`📊 Statistiques:`)
    console.log(`   - Produits: ${totalProducts}`)
    console.log(`   - Variantes: ${totalVariants}`)
    console.log(`   - Stocks: ${totalStocks}`)
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la base de données:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
updateDatabase()
