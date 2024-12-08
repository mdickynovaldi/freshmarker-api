import { PrismaClient } from "@prisma/client";

import { dataProducts } from "./seed/products";

const prisma = new PrismaClient();

async function main() {
  for (const product of dataProducts) {
    const upsertedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.info(`🍎 Product: ${upsertedProduct.name}`);
  }

  console.log(`✅ Seed completed`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
