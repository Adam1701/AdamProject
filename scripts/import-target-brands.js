/*
  Importer des produits ciblés (Nike/Adidas) avec variantes et images réelles.
  - Récupère depuis KicksCrew (RapidAPI)
  - Crée Product + Variant + Image (+ Stock minimal) si non existant
*/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const KICKSCREW_API_URL = 'https://kickscrew-sneakers-data.p.rapidapi.com/product/bycollection/v2';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

const TARGETS = [
  { collection: 'nike', name: 'Nike' },
  { collection: 'adidas', name: 'Adidas' },
  { collection: 'new-balance', name: 'New Balance' },
  { collection: 'converse', name: 'Converse' },
  { collection: 'puma', name: 'Puma' },
];

const genderMapping = {
  MENS: 'men',
  WOMENS: 'women',
  KIDS: 'kids',
  BABY: 'kids',
  UNISEX: 'men',
};

async function fetchProducts(collection, page = 1, limit = 50) {
  const url = `${KICKSCREW_API_URL}?collection=${collection}&page=${page}&limit=${limit}`;
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-host': 'kickscrew-sneakers-data.p.rapidapi.com',
      'x-rapidapi-key': API_KEY,
    },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data?.data?.products ?? [];
}

function mapCategory(apiGender, fallback = 'men') {
  const k = String(apiGender || '').toUpperCase();
  return genderMapping[k] || fallback;
}

async function ensureSizes() {
  // Ensure a minimal set of sizes exists to create one stock per product
  const sizes = [
    { label: '42', category: 'men' },
    { label: '38', category: 'women' },
    { label: '35', category: 'kids' },
  ];
  for (const s of sizes) {
    await prisma.size.upsert({
      where: { label_category: { label: s.label, category: s.category } },
      update: {},
      create: s,
    });
  }
}

async function importOne(apiProduct, brandName) {
  const title = apiProduct.title || apiProduct.name || 'Sneaker';
  const price = Math.round(apiProduct.price || apiProduct.minPrice || 99);
  const image = (apiProduct.images && apiProduct.images[0]) || apiProduct.image;
  if (!image) return { skipped: true, reason: 'no_image' };

  const category = mapCategory(apiProduct.gender, 'men');

  // Avoid duplicates by name + brand (best-effort)
  const exists = await prisma.product.findFirst({
    where: { name: `${brandName} ${title}`, brand: brandName },
    select: { id: true },
  });
  if (exists) return { skipped: true, reason: 'duplicate' };

  const product = await prisma.product.create({
    data: {
      name: `${brandName} ${title}`,
      brand: brandName,
      category,
      price,
      currency: 'EUR',
    },
  });

  const variant = await prisma.variant.create({
    data: {
      productId: product.id,
      colorName: apiProduct.color || 'Default',
    },
  });

  await prisma.image.create({
    data: { variantId: variant.id, url: image, sort: 0 },
  });

  // Minimal stock (one size based on category)
  const sizeLabel = category === 'women' ? '38' : category === 'kids' ? '35' : '42';
  const size = await prisma.size.findUnique({
    where: { label_category: { label: sizeLabel, category } },
  });
  if (size) {
    await prisma.stock.create({
      data: { variantId: variant.id, sizeId: size.id, quantity: 5 },
    });
  }

  return { created: true, productId: product.id };
}

async function main() {
  await ensureSizes();
  let created = 0;
  for (const target of TARGETS) {
    // try first 10 pages * 50 = 500 per brand, stop when ~60 created overall
    for (let page = 1; page <= 10; page++) {
      const list = await fetchProducts(target.collection, page, 50);
      for (const p of list) {
        const hasImg = (p?.images?.[0] || p?.image) ? true : false;
        const hasPrice = (p?.price || p?.minPrice) ? true : false;
        if (!hasImg || !hasPrice) continue;
        const res = await importOne(p, target.name);
        if (res.created) created++;
        if (created >= 60) break;
      }
      if (created >= 60) break;
    }
  }

  console.log(JSON.stringify({ success: true, created }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


