const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration de l'API KicksCrew
const KICKSCREW_API_URL = 'https://kickscrew-sneakers-data.p.rapidapi.com/product/bycollection/v2';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

// Marques à traiter
const BRANDS = [
  { collection: 'nike', name: 'Nike' },
  { collection: 'adidas', name: 'Adidas' },
  { collection: 'new-balance', name: 'New Balance' },
  { collection: 'converse', name: 'Converse' },
  { collection: 'puma', name: 'Puma' }
];

// Fonction pour récupérer les produits depuis l'API
async function fetchProducts(collection, limit = 50) {
  try {
    const response = await fetch(`${KICKSCREW_API_URL}?collection=${collection}&page=1&limit=${limit}`, {
      headers: {
        'x-rapidapi-host': 'kickscrew-sneakers-data.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits ${collection}:`, error);
    return [];
  }
}

// Fonction pour mettre à jour les images des produits
async function updateProductImages() {
  console.log('🔄 Début de la mise à jour des images des produits...');
  
  let totalUpdated = 0;
  
  for (const brand of BRANDS) {
    console.log(`\n📦 Récupération des produits ${brand.name}...`);
    
    try {
      const apiProducts = await fetchProducts(brand.collection, 50);
      console.log(`📦 ${apiProducts.length} produits trouvés pour ${brand.name}`);
      
      for (const apiProduct of apiProducts) {
        try {
          // Chercher le produit correspondant dans la base de données
          const existingProduct = await prisma.product.findFirst({
            where: {
              name: {
                contains: apiProduct.title || apiProduct.name || 'Sneaker'
              },
              brand: brand.name
            },
            include: { variants: { include: { images: true } } }
          });
          
          if (existingProduct && apiProduct.image) {
            // Mettre à jour l'image de la première variante
            if (existingProduct.variants[0] && existingProduct.variants[0].images[0]) {
              await prisma.image.update({
                where: { id: existingProduct.variants[0].images[0].id },
                data: { url: apiProduct.image }
              });
              
              console.log(`✅ Image mise à jour pour: ${existingProduct.name}`);
              totalUpdated++;
            }
          }
        } catch (error) {
          console.error(`❌ Erreur lors de la mise à jour du produit:`, error.message);
        }
      }
    } catch (error) {
      console.error(`❌ Erreur pour la marque ${brand.name}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Mise à jour terminée !`);
  console.log(`✅ ${totalUpdated} images mises à jour`);
}

// Exécuter le script
updateProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
