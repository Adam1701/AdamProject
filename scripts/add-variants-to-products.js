const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Images par défaut pour chaque marque
const brandImages = {
  'Nike': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
  'Adidas': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
  'New Balance': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
  'Converse': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
  'Puma': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop'
};

// Tailles par catégorie
const sizesByCategory = {
  'men': ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
  'women': ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
  'kids': ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8']
};

async function addVariantsToProducts() {
  console.log('🎯 Début de l\'ajout des variantes aux produits...');
  
  // Récupérer tous les produits sans variantes
  const products = await prisma.product.findMany({
    where: {
      variants: {
        none: {}
      }
    }
  });

  console.log(`📦 ${products.length} produits trouvés sans variantes`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // Créer une variante par défaut
      const variant = await prisma.variant.create({
        data: {
          productId: product.id,
          colorName: 'Default',
          images: {
            create: {
              url: brandImages[product.brand] || brandImages['Nike'],
              sort: 0
            }
          }
        }
      });

      // Créer les tailles pour cette catégorie
      const sizes = sizesByCategory[product.category] || sizesByCategory['men'];
      
      for (const sizeLabel of sizes) {
        // Vérifier si la taille existe déjà
        let size = await prisma.size.findFirst({
          where: {
            label: sizeLabel,
            category: product.category
          }
        });

        // Créer la taille si elle n'existe pas
        if (!size) {
          size = await prisma.size.create({
            data: {
              label: sizeLabel,
              category: product.category
            }
          });
        }

        // Créer le stock pour cette taille
        await prisma.stock.create({
          data: {
            variantId: variant.id,
            sizeId: size.id,
            quantity: Math.floor(Math.random() * 10) + 1 // Stock aléatoire entre 1 et 10
          }
        });
      }

      console.log(`✅ Variante ajoutée pour: ${product.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${product.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n🎉 Ajout des variantes terminé !');
  console.log(`✅ ${successCount} produits traités avec succès`);
  console.log(`❌ ${errorCount} erreurs`);
  
  await prisma.$disconnect();
}

// Exécuter le script
addVariantsToProducts().catch(console.error);
