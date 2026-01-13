import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Stock photos for hair extensions
const stockPhotos = {
  straight: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  bodyWave: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=800',
  curly: 'https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=800',
  frontal: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
  frontalHD: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800',
  closure: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800',
};

// Bundle prices (Straight & Body Wave)
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

// 13x4 Transparent frontal prices
const frontal13x4TransparentPrices: Record<number, number> = {
  12: 8500, 14: 9000, 16: 10500, 18: 11000, 20: 12000, 22: 12500, 24: 18000, 26: 19500,
};

// 13x4 HD frontal prices
const frontal13x4HDPrices: Record<number, number> = {
  12: 11000, 14: 11500, 16: 12000, 18: 13000, 20: 14000, 22: 15500, 24: 20400, 26: 22400,
};

// 13x6 Transparent frontal prices (12-22 inches only)
const frontal13x6TransparentPrices: Record<number, number> = {
  12: 10500, 14: 11000, 16: 12000, 18: 13400, 20: 15500, 22: 17000,
};

// 13x6 HD frontal prices (12-22 inches only)
const frontal13x6HDPrices: Record<number, number> = {
  12: 14000, 14: 15000, 16: 16000, 18: 17000, 20: 19000, 22: 20500,
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🌱 Seeding hair extension products...');

  const products: any[] = [];

  // ============================================
  // BUNDLES - Straight (10-40 inches)
  // ============================================
  for (const [inches, priceCents] of Object.entries(bundlePrices)) {
    products.push({
      name: `Straight Bundle - ${inches} Inch`,
      slug: `straight-bundle-${inches}-inch`,
      description: `Premium quality straight hair bundle in natural color. ${inches} inches of luxurious, silky straight hair that blends seamlessly with your natural hair. Can be colored, curled, and styled as desired.`,
      priceCents: priceCents,
      stock: 50,
      sku: `BUNDLE-ST-${inches}`,
      mainImageUrl: stockPhotos.straight,
      tags: ['bundle', 'straight', 'natural-color', `${inches}-inch`],
      category: 'Hair Extensions',
    });
  }

  // ============================================
  // BUNDLES - Body Wave (10-40 inches)
  // ============================================
  for (const [inches, priceCents] of Object.entries(bundlePrices)) {
    products.push({
      name: `Body Wave Bundle - ${inches} Inch`,
      slug: `body-wave-bundle-${inches}-inch`,
      description: `Premium quality body wave hair bundle in natural color. ${inches} inches of beautiful, bouncy body wave texture. Minimal shedding, can be colored and heat styled.`,
      priceCents: priceCents,
      stock: 50,
      sku: `BUNDLE-BW-${inches}`,
      mainImageUrl: stockPhotos.bodyWave,
      tags: ['bundle', 'body-wave', 'natural-color', `${inches}-inch`],
      category: 'Hair Extensions',
    });
  }

  // ============================================
  // BUNDLES - Curly (10-30 inches, +$10)
  // ============================================
  for (const [inches, priceCents] of Object.entries(curlyBundlePrices)) {
    products.push({
      name: `Curly Bundle - ${inches} Inch`,
      slug: `curly-bundle-${inches}-inch`,
      description: `Premium quality curly hair bundle in natural color. ${inches} inches of gorgeous, defined curls. Maintains curl pattern after washing. Can be colored and styled.`,
      priceCents: priceCents,
      stock: 40,
      sku: `BUNDLE-CU-${inches}`,
      mainImageUrl: stockPhotos.curly,
      tags: ['bundle', 'curly', 'natural-color', `${inches}-inch`],
      category: 'Hair Extensions',
    });
  }

  // ============================================
  // FRONTALS - 13x4 Transparent (Straight & Body Wave)
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x4TransparentPrices)) {
    // Straight
    products.push({
      name: `13x4 Transparent Frontal Straight - ${inches} Inch`,
      slug: `13x4-transparent-frontal-straight-${inches}-inch`,
      description: `13x4 transparent lace frontal in straight texture. ${inches} inches, natural color. Transparent lace blends with all skin tones. Pre-plucked hairline with baby hairs.`,
      priceCents: priceCents,
      stock: 30,
      sku: `FRONT-13X4-T-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal,
      tags: ['frontal', '13x4', 'transparent', 'straight', `${inches}-inch`],
      category: 'Frontals',
    });
    // Body Wave
    products.push({
      name: `13x4 Transparent Frontal Body Wave - ${inches} Inch`,
      slug: `13x4-transparent-frontal-body-wave-${inches}-inch`,
      description: `13x4 transparent lace frontal in body wave texture. ${inches} inches, natural color. Transparent lace for invisible hairline. Pre-plucked with natural baby hairs.`,
      priceCents: priceCents,
      stock: 30,
      sku: `FRONT-13X4-T-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal,
      tags: ['frontal', '13x4', 'transparent', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
    });
  }

  // ============================================
  // FRONTALS - 13x4 HD (Straight & Body Wave)
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x4HDPrices)) {
    // Straight
    products.push({
      name: `13x4 HD Frontal Straight - ${inches} Inch`,
      slug: `13x4-hd-frontal-straight-${inches}-inch`,
      description: `13x4 HD lace frontal in straight texture. ${inches} inches, natural color. Ultra-thin HD lace melts into skin for undetectable results. Pre-plucked hairline.`,
      priceCents: priceCents,
      stock: 25,
      sku: `FRONT-13X4-HD-ST-${inches}`,
      mainImageUrl: stockPhotos.frontalHD,
      tags: ['frontal', '13x4', 'hd', 'straight', `${inches}-inch`],
      category: 'Frontals',
    });
    // Body Wave
    products.push({
      name: `13x4 HD Frontal Body Wave - ${inches} Inch`,
      slug: `13x4-hd-frontal-body-wave-${inches}-inch`,
      description: `13x4 HD lace frontal in body wave texture. ${inches} inches, natural color. Premium HD lace for seamless, invisible installation. Pre-plucked with baby hairs.`,
      priceCents: priceCents,
      stock: 25,
      sku: `FRONT-13X4-HD-BW-${inches}`,
      mainImageUrl: stockPhotos.frontalHD,
      tags: ['frontal', '13x4', 'hd', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
    });
  }

  // ============================================
  // FRONTALS - 13x6 Transparent (Straight & Body Wave)
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x6TransparentPrices)) {
    // Straight
    products.push({
      name: `13x6 Transparent Frontal Straight - ${inches} Inch`,
      slug: `13x6-transparent-frontal-straight-${inches}-inch`,
      description: `13x6 transparent lace frontal in straight texture. ${inches} inches, natural color. Larger parting space for versatile styling. Pre-plucked with natural hairline.`,
      priceCents: priceCents,
      stock: 20,
      sku: `FRONT-13X6-T-ST-${inches}`,
      mainImageUrl: stockPhotos.frontal,
      tags: ['frontal', '13x6', 'transparent', 'straight', `${inches}-inch`],
      category: 'Frontals',
    });
    // Body Wave
    products.push({
      name: `13x6 Transparent Frontal Body Wave - ${inches} Inch`,
      slug: `13x6-transparent-frontal-body-wave-${inches}-inch`,
      description: `13x6 transparent lace frontal in body wave texture. ${inches} inches, natural color. Deep parting space allows for multiple styling options. Pre-plucked.`,
      priceCents: priceCents,
      stock: 20,
      sku: `FRONT-13X6-T-BW-${inches}`,
      mainImageUrl: stockPhotos.frontal,
      tags: ['frontal', '13x6', 'transparent', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
    });
  }

  // ============================================
  // FRONTALS - 13x6 HD (Straight & Body Wave)
  // ============================================
  for (const [inches, priceCents] of Object.entries(frontal13x6HDPrices)) {
    // Straight
    products.push({
      name: `13x6 HD Frontal Straight - ${inches} Inch`,
      slug: `13x6-hd-frontal-straight-${inches}-inch`,
      description: `13x6 HD lace frontal in straight texture. ${inches} inches, natural color. Premium HD lace with extended parting. Melts seamlessly for flawless look.`,
      priceCents: priceCents,
      stock: 15,
      sku: `FRONT-13X6-HD-ST-${inches}`,
      mainImageUrl: stockPhotos.frontalHD,
      tags: ['frontal', '13x6', 'hd', 'straight', `${inches}-inch`],
      category: 'Frontals',
    });
    // Body Wave
    products.push({
      name: `13x6 HD Frontal Body Wave - ${inches} Inch`,
      slug: `13x6-hd-frontal-body-wave-${inches}-inch`,
      description: `13x6 HD lace frontal in body wave texture. ${inches} inches, natural color. Ultra-thin HD lace with 6-inch parting space. Undetectable finish.`,
      priceCents: priceCents,
      stock: 15,
      sku: `FRONT-13X6-HD-BW-${inches}`,
      mainImageUrl: stockPhotos.frontalHD,
      tags: ['frontal', '13x6', 'hd', 'body-wave', `${inches}-inch`],
      category: 'Frontals',
    });
  }

  // ============================================
  // CLOSURES - Placeholder (prices TBD)
  // ============================================
  products.push({
    name: 'Closure - Coming Soon',
    slug: 'closure-coming-soon',
    description: 'Premium lace closures coming soon. Check back for pricing and availability.',
    priceCents: 0,
    stock: 0,
    sku: 'CLOSURE-TBD',
    mainImageUrl: stockPhotos.closure,
    tags: ['closure', 'coming-soon'],
    category: 'Closures',
    isActive: false,
  });

  // ============================================
  // LASHES - Authentic products
  // ============================================
  const lashProducts = [
    {
      name: 'Queen Mink Lashes',
      slug: 'queen-mink-lashes',
      description: 'Luxurious 3D mink lashes for the ultimate glamorous look. Handcrafted with premium mink fur, lightweight and reusable up to 25 times.',
      priceCents: 2499,
      stock: 150,
      sku: 'LASH-QUEEN-001',
      mainImageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
      tags: ['mink', 'luxury', 'bestseller', '3d'],
      category: 'Lashes',
    },
    {
      name: 'Princess Faux Mink Set',
      slug: 'princess-faux-mink-set',
      description: 'Cruelty-free faux mink lashes with stunning volume. Set includes 5 pairs from natural to dramatic styles.',
      priceCents: 3499,
      stock: 200,
      sku: 'LASH-PRINCESS-002',
      mainImageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800',
      tags: ['faux-mink', 'vegan', 'set', 'cruelty-free'],
      category: 'Lashes',
    },
    {
      name: 'Natural Beauty Lashes',
      slug: 'natural-beauty-lashes',
      description: 'Subtle, wispy lashes for an effortlessly natural look. Perfect for everyday wear.',
      priceCents: 1499,
      stock: 300,
      sku: 'LASH-NATURAL-003',
      mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800',
      tags: ['natural', 'everyday', 'lightweight'],
      category: 'Lashes',
    },
    {
      name: 'Drama Queen Volume Lashes',
      slug: 'drama-queen-volume-lashes',
      description: 'Maximum volume and drama for those who love to stand out. Perfect for special events.',
      priceCents: 2999,
      stock: 100,
      sku: 'LASH-DRAMA-004',
      mainImageUrl: 'https://images.unsplash.com/photo-1588495752527-77d73a9a0b75?w=800',
      tags: ['dramatic', 'volume', 'bold', 'party'],
      category: 'Lashes',
    },
    {
      name: 'Magnetic Lash Kit',
      slug: 'magnetic-lash-kit',
      description: 'Revolutionary magnetic lashes with magnetic eyeliner. No glue needed! Kit includes 2 pairs.',
      priceCents: 3999,
      stock: 80,
      sku: 'LASH-MAG-005',
      mainImageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800',
      tags: ['magnetic', 'kit', 'easy-apply'],
      category: 'Lashes',
    },
    {
      name: 'Wispy Cat Eye Lashes',
      slug: 'wispy-cat-eye-lashes',
      description: 'Elongated outer corners for the perfect cat eye effect. Lightweight and comfortable.',
      priceCents: 1999,
      stock: 120,
      sku: 'LASH-CAT-006',
      mainImageUrl: 'https://images.unsplash.com/photo-1516914589923-f105f1535f88?w=800',
      tags: ['cat-eye', 'wispy', 'elegant'],
      category: 'Lashes',
    },
  ];

  for (const lash of lashProducts) {
    products.push(lash);
  }

  // ============================================
  // ACCESSORIES - Authentic products
  // ============================================
  const accessoryProducts = [
    {
      name: 'Lash Adhesive - Strong Hold',
      slug: 'lash-adhesive-strong-hold',
      description: 'Professional-grade lash adhesive. Waterproof, dries clear, latex-free. All-day hold.',
      priceCents: 899,
      stock: 500,
      sku: 'ACC-GLUE-001',
      mainImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      tags: ['adhesive', 'waterproof', 'latex-free'],
      category: 'Accessories',
    },
    {
      name: 'Lash Applicator Tool',
      slug: 'lash-applicator-tool',
      description: 'Precision lash applicator for perfect placement. Ergonomic rose gold design.',
      priceCents: 1299,
      stock: 250,
      sku: 'ACC-TOOL-002',
      mainImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      tags: ['tool', 'applicator', 'rose-gold'],
      category: 'Accessories',
    },
    {
      name: 'Luxury Lash Storage Case',
      slug: 'luxury-lash-storage-case',
      description: 'Elegant storage case for up to 10 pairs. Features mirror inside lid.',
      priceCents: 1999,
      stock: 120,
      sku: 'ACC-CASE-003',
      mainImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
      tags: ['storage', 'case', 'luxury'],
      category: 'Accessories',
    },
    {
      name: 'Lash Serum - Growth Formula',
      slug: 'lash-serum-growth-formula',
      description: 'Nourishing lash serum to promote natural lash growth and strength.',
      priceCents: 2999,
      stock: 100,
      sku: 'ACC-SERUM-004',
      mainImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
      tags: ['serum', 'growth', 'treatment'],
      category: 'Accessories',
    },
    {
      name: 'Eyelash Curler - Professional',
      slug: 'eyelash-curler-professional',
      description: 'Professional-grade eyelash curler with silicone pads. Creates long-lasting curl.',
      priceCents: 1599,
      stock: 180,
      sku: 'ACC-CURLER-005',
      mainImageUrl: 'https://images.unsplash.com/photo-1512207576147-0ac0f6f5e1c2?w=800',
      tags: ['curler', 'professional', 'tool'],
      category: 'Accessories',
    },
    {
      name: 'Lash Remover Solution',
      slug: 'lash-remover-solution',
      description: 'Gentle lash adhesive remover. Oil-based formula, safe for sensitive eyes.',
      priceCents: 799,
      stock: 300,
      sku: 'ACC-REMOVER-006',
      mainImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      tags: ['remover', 'gentle', 'oil-based'],
      category: 'Accessories',
    },
  ];

  for (const accessory of accessoryProducts) {
    products.push(accessory);
  }

  // Clear existing products first
  console.log('🗑️  Clearing existing products...');
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.inventoryLog.deleteMany({});
  await prisma.product.deleteMany({});

  // Insert all products
  console.log(`📦 Creating ${products.length} hair extension products...`);
  
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
        tags: product.tags,
        category: product.category,
        isActive: product.isActive !== false,
      },
    });
  }

  console.log('✅ Created products:');
  console.log(`   - ${Object.keys(bundlePrices).length} Straight bundles`);
  console.log(`   - ${Object.keys(bundlePrices).length} Body Wave bundles`);
  console.log(`   - ${Object.keys(curlyBundlePrices).length} Curly bundles`);
  console.log(`   - ${Object.keys(frontal13x4TransparentPrices).length * 2} 13x4 Transparent frontals`);
  console.log(`   - ${Object.keys(frontal13x4HDPrices).length * 2} 13x4 HD frontals`);
  console.log(`   - ${Object.keys(frontal13x6TransparentPrices).length * 2} 13x6 Transparent frontals`);
  console.log(`   - ${Object.keys(frontal13x6HDPrices).length * 2} 13x6 HD frontals`);
  console.log(`   - 1 Closure placeholder`);
  console.log(`   Total: ${products.length} products`);

  console.log('🎉 Hair extension seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
