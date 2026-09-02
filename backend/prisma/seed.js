import { PrismaClient } from '@prisma/client';
import { categories } from '../src/data/categories.js';
import { products } from '../src/data/products.js';

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Clean existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Seed Categories
  const categoryMap = new Map();
  for (const catName of categories) {
    const slug = slugify(catName);
    const createdCategory = await prisma.category.create({
      data: {
        name: catName,
        slug: slug
      }
    });
    categoryMap.set(catName, createdCategory.id);
    console.log(`✅ Created Category: ${catName} (ID: ${createdCategory.id})`);
  }

  // 3. Seed Products
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.category);
    if (!categoryId) {
      console.warn(`⚠️ Warning: Category "${prod.category}" not found for product "${prod.title}"`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        id: prod.id,
        title: prod.title,
        price: prod.price,
        description: prod.description,
        image: prod.image,
        categoryId: categoryId
      }
    });
    console.log(`✅ Created Product: ${createdProduct.title} (ID: ${createdProduct.id})`);
  }

  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
