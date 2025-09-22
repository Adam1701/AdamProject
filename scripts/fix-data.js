/*
  Maintenance script:
  - Set a default price for products with null or 0 price
  - Ensure each variant has at least one image (add placeholder if missing)
*/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Reasonable defaults
const DEFAULT_PRICE_EUR = 99; // Adjust if needed
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&auto=format&q=70';

async function fixZeroPrices() {
  // Find products with null or 0 price
  const productsToFix = await prisma.product.findMany({
    where: { OR: [{ price: null }, { price: 0 }] },
    select: { id: true, name: true, price: true },
  });

  if (productsToFix.length === 0) return { updated: 0 };

  const updates = await Promise.all(
    productsToFix.map((p) =>
      prisma.product.update({
        where: { id: p.id },
        data: { price: DEFAULT_PRICE_EUR },
      })
    )
  );

  return { updated: updates.length };
}

async function fixMissingVariantImages() {
  // Find variants without images
  const variants = await prisma.variant.findMany({
    where: { images: { none: {} } },
    select: { id: true },
  });

  if (variants.length === 0) return { updated: 0 };

  const creates = await Promise.all(
    variants.map((v) =>
      prisma.image.create({
        data: { variantId: v.id, url: PLACEHOLDER_IMAGE, sort: 0 },
      })
    )
  );

  return { updated: creates.length };
}

async function main() {
  const priceRes = await fixZeroPrices();
  const imageRes = await fixMissingVariantImages();

  console.log(JSON.stringify({ success: true, fixedPrices: priceRes.updated, fixedVariantImages: imageRes.updated }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


