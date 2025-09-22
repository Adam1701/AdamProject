import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration de l'API KicksCrew
const KICKSCREW_API_URL = 'https://kickscrew-sneakers-data.p.rapidapi.com/product/bycollection/v2';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

// Mapping des genres de l'API vers nos catégories
const genderMapping = {
  'MENS': 'men',
  'WOMENS': 'women', 
  'KIDS': 'kids',
  'BABY': 'kids',
  'UNISEX': 'men'
} as const;

type GenderKey = keyof typeof genderMapping;

// Fonction pour récupérer les produits depuis l'API
async function fetchNikeProducts(page: number = 1, limit: number = 50) {
  try {
    const response = await fetch(`${KICKSCREW_API_URL}?collection=nike&page=${page}&limit=${limit}`, {
      headers: {
        'x-rapidapi-host': 'kickscrew-sneakers-data.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}

// Fonction pour créer ou mettre à jour les tailles
async function ensureSizesExist(sizes: string[], category: 'men' | 'women' | 'kids') {
  const sizePromises = sizes.map(async (sizeLabel) => {
    return prisma.size.upsert({
      where: {
        label_category: {
          label: sizeLabel,
          category: category
        }
      },
      update: {},
      create: {
        label: sizeLabel,
        category: category
      }
    });
  });

  return Promise.all(sizePromises);
}

// Fonction pour importer un produit
async function importProduct(apiProduct: any) {
  try {
    // Vérifier si le produit existe déjà
    const existingProduct = await prisma.product.findUnique({
      where: { externalId: apiProduct.product_id }
    });

    if (existingProduct) {
      console.log(`Produit ${apiProduct.title} déjà existant, mise à jour...`);
      
      // Mettre à jour le produit existant
      const updatedProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: apiProduct.title,
          price: apiProduct.lowest_price || null,
          productUrl: apiProduct.url,
          updatedAt: new Date()
        }
      });

      return updatedProduct;
    }

    // Créer le nouveau produit
    const category = genderMapping[apiProduct.gender as GenderKey] || 'men';
    
    const productData = {
      externalId: apiProduct.product_id,
      name: apiProduct.title,
      brand: apiProduct.brand,
      category: category,
      productUrl: apiProduct.url,
      price: apiProduct.lowest_price || null,
      currency: 'USD',
    };

    // S'assurer que les tailles existent
    if (apiProduct.sizes && apiProduct.sizes.length > 0) {
      await ensureSizesExist(apiProduct.sizes, category);
    }

    // Créer le produit avec ses variants
    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: [{
            colorName: apiProduct.nickname || apiProduct.main_color || 'Default',
            images: {
              create: apiProduct.image ? [{
                url: apiProduct.image,
                sort: 0
              }] : []
            }
          }]
        }
      },
      include: {
        variants: {
          include: {
            images: true
          }
        }
      }
    });

    // Créer les stocks pour chaque taille
    if (apiProduct.sizes && apiProduct.sizes.length > 0) {
      const variant = product.variants[0];
      
      for (const sizeLabel of apiProduct.sizes) {
        const size = await prisma.size.findUnique({
          where: {
            label_category: {
              label: sizeLabel,
              category: category
            }
          }
        });

        if (size) {
          await prisma.stock.create({
            data: {
              variantId: variant.id,
              sizeId: size.id,
              quantity: Math.floor(Math.random() * 10) + 1 // Quantité aléatoire entre 1 et 10
            }
          });
        }
      }
    }

    console.log(`✅ Produit importé: ${product.name}`);
    return product;

  } catch (error) {
    console.error(`❌ Erreur lors de l'importation du produit ${apiProduct.title}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pages = 2, productsPerPage = 20 } = await request.json();
    
    console.log('🚀 Début de l\'importation des produits Nike...');
    
    let totalImported = 0;
    let totalErrors = 0;
    const importedProducts = [];

    for (let page = 1; page <= pages; page++) {
      console.log(`\n📄 Récupération de la page ${page}...`);
      
      try {
        const apiData = await fetchNikeProducts(page, productsPerPage);
        
        if (!apiData.data || !apiData.data.products) {
          console.log('Aucun produit trouvé sur cette page');
          break;
        }

        const products = apiData.data.products;
        console.log(`📦 ${products.length} produits trouvés sur la page ${page}`);

        // Filtrer seulement les sneakers
        const sneakers = products.filter((p: any) => p.product_type === 'Sneakers');
        console.log(`👟 ${sneakers.length} sneakers trouvées`);

        for (const product of sneakers) {
          try {
            const importedProduct = await importProduct(product);
            importedProducts.push(importedProduct);
            totalImported++;
          } catch (error) {
            totalErrors++;
            console.error(`Erreur avec le produit ${product.title}:`, error);
          }
        }

        // Pause entre les pages pour éviter de surcharger l'API
        if (page < pages) {
          console.log('⏳ Pause de 2 secondes avant la page suivante...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la page ${page}:`, error);
        totalErrors++;
      }
    }

    console.log(`\n🎉 Importation terminée !`);
    console.log(`✅ ${totalImported} produits importés avec succès`);
    console.log(`❌ ${totalErrors} erreurs rencontrées`);

    return NextResponse.json({
      success: true,
      message: `Importation terminée: ${totalImported} produits importés, ${totalErrors} erreurs`,
      data: {
        totalImported,
        totalErrors,
        importedProducts: importedProducts.slice(0, 10) // Retourner seulement les 10 premiers pour éviter une réponse trop lourde
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'importation des produits Nike',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint pour importer des produits Nike. Utilisez POST avec { pages: number, productsPerPage: number }'
  });
}
