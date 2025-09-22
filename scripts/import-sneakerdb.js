/*
  Import depuis TheSneakerDatabase (RapidAPI): images + prix
*/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const API_URL = 'https://the-sneaker-database.p.rapidapi.com/sneakers';
const API_HOST = 'the-sneaker-database.p.rapidapi.com';
const API_KEY = 'f7a4e24d73msh48d6140cdc055dep13c024jsn9a4f2c3d540b';

const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Converse', 'Puma'];

async function ensureSizes() {
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

function pickCategory(gender) {
  const g = String(gender || '').toLowerCase();
  if (g.includes('women')) return 'women';
  if (g.includes('kid') || g.includes('grade school') || g.includes('gs')) return 'kids';
  return 'men';
}

async function fetchBrand(brand, page = 1, limit = 50) {
  const url = `${API_URL}?limit=${limit}&page=${page}&brand=${encodeURIComponent(brand)}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Host': API_HOST,
      'X-RapidAPI-Key': API_KEY,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.results || data?.data || [];
}

async function importOne(item) {
  const title = item.title || item.name || 'Sneaker';
  const brand = item.brand || 'Nike';
  const price = Math.round(item.retailPrice || item?.lowestResellPrice?.stockX || 99);
  // Normalize image candidate to a string URL
  const imageCandidate = item.media?.imageUrl || item.image || item.thumbnail || item.mainPictureUrl;
  const image = typeof imageCandidate === 'string'
    ? imageCandidate
    : (imageCandidate?.original || imageCandidate?.small || imageCandidate?.thumbnail || null);
  if (!image || !price) return { skipped: true };
  const category = pickCategory(item.gender);

  const existing = await prisma.product.findFirst({ where: { name: `${brand} ${title}`, brand }, select: { id: true } });
  if (existing) return { skipped: true };

  const product = await prisma.product.create({
    data: {
      name: `${brand} ${title}`,
      brand,
      category,
      price,
      currency: 'EUR',
    },
  });

  const variant = await prisma.variant.create({ data: { productId: product.id, colorName: item.colorway || 'Default' } });
  await prisma.image.create({ data: { variantId: variant.id, url: image, sort: 0 } });

  const sizeLabel = category === 'women' ? '38' : category === 'kids' ? '35' : '42';
  const size = await prisma.size.findUnique({ where: { label_category: { label: sizeLabel, category } } });
  if (size) {
    await prisma.stock.create({ data: { variantId: variant.id, sizeId: size.id, quantity: 5 } });
  }

  return { created: true };
}

async function main() {
  await ensureSizes();
  let created = 0;
  for (const brand of BRANDS) {
    for (let page = 1; page <= 5; page++) {
      const list = await fetchBrand(brand, page, 50);
      for (const item of list) {
        const res = await importOne(item);
        if (res.created) created++;
        if (created >= 60) break;
      }
      if (created >= 60) break;
    }
    if (created >= 60) break;
  }
  console.log(JSON.stringify({ success: true, created }, null, 2));
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });


