const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.product.count();
  const withValid = await prisma.product.count({
    where: {
      price: { gt: 0 },
      variants: { some: { images: { some: {} } } },
    },
  });
  console.log(JSON.stringify({ totalProducts: total, withImageAndPrice: withValid }, null, 2));
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });


