import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Stock photos
const stockPhotos = {
  straight: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  bodyWave: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=800',
  curly: 'https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=800',
  frontal13x4T: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
  frontal13x4HD: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800',
  frontal13x6T: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800',
  frontal13x6HD: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800',
  closure: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  lashes: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
  accessories: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
};

// Bundle prices for Straight & Body Wave (10-40 inches)
const bundlePrices: Record<number, number> = {
  10: 3000, 12: 3500, 14: 4000, 16: 4500, 18: 5500, 20: 6000,
  22: 7500, 24: 8500, 26: 9500, 28: 10500, 30: 11500,
  32: 13000, 34: 15000, 36: 16000, 38: 17000, 40: 19000,
};

// Curly bundle prices (+$10 = +1000 cents, only 10-30 inches)
const curlyBundlePrices: Record<number, number> = {
  10: 4000, 12: 4500, 14: 5000, 16: 5500, 18: 6500, 20: 7000,
  22: 8500, 24: 9500, 26: 10500, 28: 11500, 30: 12500,
};

// 13x4 Transparent frontal prices (12-26")
const frontal13x4TPrices: Record<number, number> = {
  12: 8500, 14: 9000, 16: 10500, 18: 11000, 20: 12000, 22: 12500, 24: 18000, 26: 19500,
};

// 13x4 HD frontal prices (12-26")
const frontal13x4HDPrices: Record<number, number> = {
  12: 11000, 14: 11500, 16: 12000, 18: 13000, 20: 14000, 22: 15500, 24: 20400, 26: 22400,
};

// 13x6 Transparent frontal prices (12-22")
const frontal13x6TPrices: Record<number, number> = {
  12: 10500, 14: 11000, 16: 12000, 18: 13400, 20: 15500, 22: 17000,
};

// 13x6 HD frontal prices (12-22")
const frontal13x6HDPrices: Record<number, number> = {
  12: 14000, 14: 15000, 16: 16000, 18: 17000, 20: 19000, 22: 20500,
};

async function main() {
  console.log('🌱 Seeding all products...');

  const products: any[] = [];

  // ============================================
  // HAIR EXTENSIONS > BUNDLES > STRAIGHT
  // ============================================
  for (const [inches, priceCents] of Object.entries(bundlePrices)) {
    products.push({
      name: `Straight Bundle - ${inches}"`,
      slug: `straight-bundle-${inches}-inch`,
      description: `Premium straight hair bundle in natural color. ${inches} inches of luxurious, silky straight hair. Can be colored, curled, and styled.`,
      priceCents: priceCents,
      stock: 50,
      sku: `BUNDLE-ST-${inches}`,
      mainImageUrl: stockPhotos.straight,
      tags: ['bundle', 'straight', 'natural-color', `${inches}-inch`],
      category: 'Bundles',
      subcategory: 'Straight',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > BUNDLES > BODY WAVE
  // ============================================
  for (const [inches, priceCents] of Object.entries(bundlePrices)) {
    products.push({
      name: `Body Wave Bundle - ${inches}"`,
      slug: `body-wave-bundle-${inches}-inch`,
      description: `Premium body wave hair bundle in natural color. ${inches} inches of beautiful, bouncy texture. Minimal shedding, can be colored.`,
      priceCents: priceCents,
      stock: 50,
      sku: `BUNDLE-BW-${inches}`,
      mainImageUrl: stockPhotos.bodyWave,
      tags: ['bundle', 'body-wave', 'natural-color', `${inches}-inch`],
      category: 'Bundles',
      subcategory: 'Body Wave',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > BUNDLES > CURLY (10-30" only, +$10)
  // ============================================
  for (const [inches, priceCents] of Object.entries(curlyBundlePrices)) {
    products.push({
      name: `Curly Bundle - ${inches}"`,
      slug: `curly-bundle-${inches}-inch`,
      description: `Premium curly hair bundle in natural color. ${inches} inches of gorgeous, defined curls. Maintains curl pattern after washing.`,
      priceCents: priceCents,
      stock: 40,
      sku: `BUNDLE-CU-${inches}`,
      mainImageUrl: stockPhotos.curly,
      tags: ['bundle', 'curly', 'natural-color', `${inches}-inch`],
      category: 'Bundles',
      subcategory: 'Curly',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > FRONTALS > 13x4 TRANSPARENT
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x4TPrices)) {
    // Straight
    products.push({
      name: `13x4 Transparent Frontal Straight - ${inches}"`,
      slug: `13x4-transparent-frontal-straight-${inches}-inch`,
      description: `13x4 transparent lace frontal, straight texture. ${inches} inches, natural color. Blends with all skin tones. Pre-plucked hairline.`,
      priceCents: priceCents,
      stock: 30,
      sku: `FRONT-13X4-T-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal13x4T,
      tags: ['frontal', '13x4', 'transparent', 'straight', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x4 Transparent',
    });
    // Body Wave
    products.push({
      name: `13x4 Transparent Frontal Body Wave - ${inches}"`,
      slug: `13x4-transparent-frontal-body-wave-${inches}-inch`,
      description: `13x4 transparent lace frontal, body wave texture. ${inches} inches, natural color. Invisible hairline. Pre-plucked with baby hairs.`,
      priceCents: priceCents,
      stock: 30,
      sku: `FRONT-13X4-T-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal13x4T,
      tags: ['frontal', '13x4', 'transparent', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x4 Transparent',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > FRONTALS > 13x4 HD
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x4HDPrices)) {
    // Straight
    products.push({
      name: `13x4 HD Frontal Straight - ${inches}"`,
      slug: `13x4-hd-frontal-straight-${inches}-inch`,
      description: `13x4 HD lace frontal, straight texture. ${inches} inches, natural color. Ultra-thin HD lace melts into skin. Pre-plucked.`,
      priceCents: priceCents,
      stock: 25,
      sku: `FRONT-13X4-HD-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal13x4HD,
      tags: ['frontal', '13x4', 'hd', 'straight', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x4 HD',
    });
    // Body Wave
    products.push({
      name: `13x4 HD Frontal Body Wave - ${inches}"`,
      slug: `13x4-hd-frontal-body-wave-${inches}-inch`,
      description: `13x4 HD lace frontal, body wave texture. ${inches} inches, natural color. Premium HD lace for seamless install. Pre-plucked.`,
      priceCents: priceCents,
      stock: 25,
      sku: `FRONT-13X4-HD-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal13x4HD,
      tags: ['frontal', '13x4', 'hd', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x4 HD',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > FRONTALS > 13x6 TRANSPARENT
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x6TPrices)) {
    // Straight
    products.push({
      name: `13x6 Transparent Frontal Straight - ${inches}"`,
      slug: `13x6-transparent-frontal-straight-${inches}-inch`,
      description: `13x6 transparent lace frontal, straight texture. ${inches} inches, natural color. Larger parting space for versatile styling.`,
      priceCents: priceCents,
      stock: 20,
      sku: `FRONT-13X6-T-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal13x6T,
      tags: ['frontal', '13x6', 'transparent', 'straight', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x6 Transparent',
    });
    // Body Wave
    products.push({
      name: `13x6 Transparent Frontal Body Wave - ${inches}"`,
      slug: `13x6-transparent-frontal-body-wave-${inches}-inch`,
      description: `13x6 transparent lace frontal, body wave texture. ${inches} inches, natural color. Deep parting for multiple styles.`,
      priceCents: priceCents,
      stock: 20,
      sku: `FRONT-13X6-T-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal13x6T,
      tags: ['frontal', '13x6', 'transparent', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x6 Transparent',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > FRONTALS > 13x6 HD
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x6HDPrices)) {
    // Straight
    products.push({
      name: `13x6 HD Frontal Straight - ${inches}"`,
      slug: `13x6-hd-frontal-straight-${inches}-inch`,
      description: `13x6 HD lace frontal, straight texture. ${inches} inches, natural color. Premium HD lace with extended parting. Flawless melt.`,
      priceCents: priceCents,
      stock: 15,
      sku: `FRONT-13X6-HD-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal13x6HD,
      tags: ['frontal', '13x6', 'hd', 'straight', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x6 HD',
    });
    // Body Wave
    products.push({
      name: `13x6 HD Frontal Body Wave - ${inches}"`,
      slug: `13x6-hd-frontal-body-wave-${inches}-inch`,
      description: `13x6 HD lace frontal, body wave texture. ${inches} inches, natural color. Ultra-thin HD lace with 6-inch parting. Undetectable.`,
      priceCents: priceCents,
      stock: 15,
      sku: `FRONT-13X6-HD-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal13x6HD,
      tags: ['frontal', '13x6', 'hd', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
      subcategory: '13x6 HD',
    });
  }

  // ============================================
  // HAIR EXTENSIONS > CLOSURES (Placeholder)
  // ============================================
  products.push({
    name: 'Closures - Coming Soon',
    slug: 'closures-coming-soon',
    description: 'Premium lace closures coming soon. Check back for pricing and availability.',
    priceCents: 0,
    stock: 0,
    sku: 'CLOSURE-TBD',
    mainImageUrl: stockPhotos.closure,
    tags: ['closure', 'coming-soon'],
    category: 'Closures',
    subcategory: 'Coming Soon',
    isActive: false,
  });

  // ============================================
  // LASHES
  // ============================================
  const lashProducts = [
    { name: 'Queen Mink Lashes', slug: 'queen-mink-lashes', priceCents: 2499, sku: 'LASH-001', tags: ['mink', 'luxury'] },
    { name: 'Princess Faux Mink Set', slug: 'princess-faux-mink-set', priceCents: 3499, sku: 'LASH-002', tags: ['faux-mink', 'set'] },
    { name: 'Natural Beauty Lashes', slug: 'natural-beauty-lashes', priceCents: 1499, sku: 'LASH-003', tags: ['natural', 'everyday'] },
    { name: 'Drama Queen Volume', slug: 'drama-queen-volume-lashes', priceCents: 2999, sku: 'LASH-004', tags: ['dramatic', 'volume'] },
    { name: 'Magnetic Lash Kit', slug: 'magnetic-lash-kit', priceCents: 3999, sku: 'LASH-005', tags: ['magnetic', 'kit'] },
    { name: 'Wispy Cat Eye Lashes', slug: 'wispy-cat-eye-lashes', priceCents: 1999, sku: 'LASH-006', tags: ['cat-eye', 'wispy'] },
  ];

  for (const lash of lashProducts) {
    products.push({
      name: lash.name,
      slug: lash.slug,
      description: `Premium quality ${lash.name.toLowerCase()}. Authentic product.`,
      priceCents: lash.priceCents,
      stock: 100,
      sku: lash.sku,
      mainImageUrl: stockPhotos.lashes,
      tags: ['lashes', ...lash.tags],
      category: 'Lashes',
      subcategory: 'All Lashes',
    });
  }

  // ============================================
  // ACCESSORIES
  // ============================================
  const accessoryProducts = [
    { name: 'Lash Adhesive - Strong Hold', slug: 'lash-adhesive-strong-hold', priceCents: 899, sku: 'ACC-001', tags: ['adhesive'] },
    { name: 'Lash Applicator Tool', slug: 'lash-applicator-tool', priceCents: 1299, sku: 'ACC-002', tags: ['tool', 'applicator'] },
    { name: 'Luxury Lash Storage Case', slug: 'luxury-lash-storage-case', priceCents: 1999, sku: 'ACC-003', tags: ['storage', 'case'] },
    { name: 'Lash Serum - Growth Formula', slug: 'lash-serum-growth-formula', priceCents: 2999, sku: 'ACC-004', tags: ['serum', 'growth'] },
    { name: 'Eyelash Curler - Professional', slug: 'eyelash-curler-professional', priceCents: 1599, sku: 'ACC-005', tags: ['curler', 'tool'] },
    { name: 'Lash Remover Solution', slug: 'lash-remover-solution', priceCents: 799, sku: 'ACC-006', tags: ['remover'] },
  ];

  for (const acc of accessoryProducts) {
    products.push({
      name: acc.name,
      slug: acc.slug,
      description: `Professional quality ${acc.name.toLowerCase()}. Authentic product.`,
      priceCents: acc.priceCents,
      stock: 200,
      sku: acc.sku,
      mainImageUrl: stockPhotos.accessories,
      tags: ['accessories', ...acc.tags],
      category: 'Accessories',
      subcategory: 'All Accessories',
    });
  }

  // Clear existing products
  console.log('🗑️  Clearing existing products...');
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.inventoryLog.deleteMany({});
  await prisma.product.deleteMany({});

  // Insert all products
  console.log(`📦 Creating ${products.length} products...`);
  
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        stock: product.stock,
        sku: product.sku,
        mainImageUrl: product.mainImageUrl,
        tags: [...product.tags, `subcat:${product.subcategory}`],
        category: product.category,
        isActive: product.isActive !== false,
      },
    });
  }

  // Count by category
  const bundleCount = products.filter(p => p.category === 'Bundles').length;
  const frontalCount = products.filter(p => p.category === 'Frontals').length;
  const closureCount = products.filter(p => p.category === 'Closures').length;
  const lashCount = products.filter(p => p.category === 'Lashes').length;
  const accCount = products.filter(p => p.category === 'Accessories').length;

  console.log('✅ Created products:');
  console.log(`   📦 Bundles: ${bundleCount}`);
  console.log(`      - Straight: 16`);
  console.log(`      - Body Wave: 16`);
  console.log(`      - Curly: 11`);
  console.log(`   📦 Frontals: ${frontalCount}`);
  console.log(`      - 13x4 Transparent: 16`);
  console.log(`      - 13x4 HD: 16`);
  console.log(`      - 13x6 Transparent: 12`);
  console.log(`      - 13x6 HD: 12`);
  console.log(`   📦 Closures: ${closureCount} (placeholder)`);
  console.log(`   💄 Lashes: ${lashCount}`);
  console.log(`   🛠️  Accessories: ${accCount}`);
  console.log(`   Total: ${products.length} products`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
