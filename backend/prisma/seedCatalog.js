import { PrismaClient } from '@prisma/client';
import { categories } from '../src/data/categories.js';
import { products } from '../src/data/products.js';

const prisma = new PrismaClient();

const slugify = (text) => text
  .toLowerCase()
  .replace(/'/g, '')
  .replace(/[^a-z0-9]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

async function main() {
  const categoryMap = new Map();

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
    categoryMap.set(name, category.id);
  }

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) throw new Error(`Missing category for ${product.title}`);

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        categoryId,
        stock: product.stock ?? 25,
      },
      create: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        categoryId,
        stock: product.stock ?? 25,
      },
    });
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), coalesce((SELECT MAX(id) FROM "Product"), 1));`,
  );

  console.log(`Catalog synced: ${products.length} products, ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error('Catalog sync failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
