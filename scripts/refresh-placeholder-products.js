/*
  Replace products whose variant images use a placeholder (Unsplash) with
  real products from KicksCrew API (with real image + price).
*/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const KICKSCREW_API_URL = 'https://kickscrew-sneakers-data.p.rapidapi.com/product/bycollection/v2';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

const PLACEHOLDER_HOST = 'images.unsplash.com';

const brandToCollection = (brand) => {
  if (!brand) return 'nike';
  const b = brand.toLowerCase();
  if (b.includes('nike')) return 'nike';
  if (b.includes('adidas')) return 'adidas';
  if (b.includes('new balance')) return 'new-balance';
  if (b.includes('converse')) return 'converse';
  if (b.includes('puma')) return 'puma';
  return 'nike';
};

async function fetchOneRealProduct(collection) {
  // try multiple pages to increase hit rate
  const pagesToTry = [1,2,3,4,5].sort(() => Math.random() - 0.5);
  for (const page of pagesToTry) {
    const url = `${KICKSCREW_API_URL}?collection=${collection}&page=${page}&limit=50`;
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'kickscrew-sneakers-data.p.rapidapi.com',
        'x-rapidapi-key': API_KEY,
      },
    });
    if (!response.ok) continue;
    const data = await response.json();
    const products = data?.data?.products ?? [];
    const p = products.find((p) => (p?.images?.[0] || p?.image) && (p?.price || p?.minPrice));
    if (p) {
      return {
        title: p.title || p.name || 'Sneaker',
        brand: p.brand || collection,
        price: Math.round(p.price || p.minPrice || 99),
        image: p.images?.[0] || p.image,
      };
    }
  }
  return null;
}

const FALLBACK_COLLECTIONS = ['nike','adidas','new-balance','converse','puma'];

async function replaceProducts() {
  const toFix = await prisma.product.findMany({
    where: {
      variants: {
        some: {
          images: { some: { url: { contains: PLACEHOLDER_HOST } } },
        },
      },
    },
    select: { id: true, name: true, brand: true, variants: { select: { id: true } } },
  });

  let replaced = 0;
  for (const product of toFix) {
    const collection = brandToCollection(product.brand);
    let real = await fetchOneRealProduct(collection);
    if (!real) {
      for (const col of FALLBACK_COLLECTIONS) {
        real = await fetchOneRealProduct(col);
        if (real) break;
      }
    }
    if (!real) continue;

    // Update product fields
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: `${real.brand} ${real.title}`,
        brand: real.brand,
        price: real.price,
      },
    });

    // Replace images on all variants with the real image as first
    for (const v of product.variants) {
      await prisma.image.deleteMany({ where: { variantId: v.id, url: { contains: PLACEHOLDER_HOST } } });
      // ensure at least one image exists
      const count = await prisma.image.count({ where: { variantId: v.id } });
      if (count === 0 && real.image) {
        await prisma.image.create({ data: { variantId: v.id, url: real.image, sort: 0 } });
      }
    }

    replaced += 1;
  }

  return { candidates: toFix.length, replaced };
}

async function main() {
  const res = await replaceProducts();
  console.log(JSON.stringify({ success: true, ...res }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


