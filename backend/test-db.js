import prisma from './src/lib/prisma.js';

async function testFetch() {
  console.log('⚡ Fetching live data from Neon PostgreSQL database...\n');

  // Fetch all products from Neon including their relation with category
  const productsFromDB = await prisma.product.findMany({
    include: {
      category: true
    }
  });

  console.log(`✅ Success! Received ${productsFromDB.length} products directly from Neon DB:\n`);
  
  productsFromDB.forEach((product) => {
    console.log(`📦 [ID ${product.id}] ${product.title}`);
    console.log(`   💰 Price: $${product.price}`);
    console.log(`   🏷️  Category: ${product.category.name} (Slug: ${product.category.slug})`);
    console.log('--------------------------------------------------');
  });

  await prisma.$disconnect();
}

testFetch().catch((err) => {
  console.error('❌ Error fetching from database:', err);
  prisma.$disconnect();
});
