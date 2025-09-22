import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration de l'API KicksCrew
const KICKSCREW_API_URL = 'https://kickscrew-sneakers-data.p.rapidapi.com/product/bycollection/v2';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

// Marques à importer avec leurs collections
const BRANDS = [
  { collection: 'nike', name: 'Nike', productsPerPage: 20 },
  { collection: 'adidas', name: 'Adidas', productsPerPage: 20 },
  { collection: 'new-balance', name: 'New Balance', productsPerPage: 20 },
  { collection: 'converse', name: 'Converse', productsPerPage: 20 },
  { collection: 'puma', name: 'Puma', productsPerPage: 20 }
];

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
async function fetchProducts(collection: string, page: number = 1, limit: number = 50) {
  try {
    const response = await fetch(`${KICKSCREW_API_URL}?collection=${collection}&page=${page}&limit=${limit}`, {
      headers: {
        'x-rapidapi-host': 'kickscrew-sneakers-data.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des produits ${collection}:`, error);
    return [];
  }
}

// Fonction pour transformer les données de l'API vers notre schéma
function transformProduct(apiProduct: any, brandName: string) {
  // Filtrer seulement les sneakers
  if (apiProduct.product_type !== 'Sneakers') {
    return null;
  }

  // Mapper le genre
  const gender = genderMapping[apiProduct.gender as GenderKey] || 'men';
  
  // Extraire les tailles disponibles
  const sizes = apiProduct.sizes || [];
  const sizeOptions = sizes.map((size: any) => ({
    size: size.toString(),
    stock: Math.floor(Math.random() * 10) + 1 // Stock aléatoire entre 1 et 10
  }));

  // Créer le nom du produit avec la marque
  const productName = `${brandName} ${apiProduct.title || apiProduct.name || 'Sneaker'}`;

  return {
    name: productName,
    price: Math.round(apiProduct.price || 0),
    category: gender,
    brand: brandName,
    sizeOptions: {
      create: sizeOptions
    }
  };
}

// Fonction pour importer les produits d'une marque
async function importBrandProducts(brand: { collection: string; name: string; productsPerPage: number }) {
  console.log(`🚀 Importation des produits ${brand.name}...`);
  
  try {
    const products = await fetchProducts(brand.collection, 1, brand.productsPerPage);
    
    if (!products || products.length === 0) {
      console.log(`❌ Aucun produit trouvé pour ${brand.name}`);
      return { success: 0, errors: 0 };
    }

    console.log(`📦 ${products.length} produits trouvés pour ${brand.name}`);

    let successCount = 0;
    let errorCount = 0;

    for (const apiProduct of products) {
      try {
        const transformedProduct = transformProduct(apiProduct, brand.name);
        
        if (!transformedProduct) {
          continue; // Skip non-sneakers
        }

        // Vérifier si le produit existe déjà
        const existingProduct = await prisma.product.findFirst({
          where: {
            name: transformedProduct.name,
            brand: brand.name
          }
        });

        if (existingProduct) {
          console.log(`Produit ${brand.name} '${transformedProduct.name}' déjà existant, mise à jour...`);
          
          // Mettre à jour le produit existant
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              price: transformedProduct.price,
              description: transformedProduct.description,
              image: transformedProduct.image
            }
          });
        } else {
          // Créer un nouveau produit
          await prisma.product.create({
            data: transformedProduct
          });
          console.log(`✅ Nouveau produit ${brand.name}: ${transformedProduct.name}`);
        }

        successCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de l'importation du produit ${brand.name}:`, error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error(`❌ Erreur lors de l'importation des produits ${brand.name}:`, error);
    return { success: 0, errors: 1 };
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Début de l\'importation multi-marques...');
    
    let totalSuccess = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (const brand of BRANDS) {
      const result = await importBrandProducts(brand);
      results.push({ brand: brand.name, ...result });
      totalSuccess += result.success;
      totalErrors += result.errors;
    }

    console.log('🎉 Importation multi-marques terminée !');

    return NextResponse.json({
      success: true,
      message: 'Importation multi-marques terminée avec succès',
      totalProducts: totalSuccess,
      totalErrors: totalErrors,
      results: results
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation multi-marques:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'importation multi-marques',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
