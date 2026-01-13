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

// Bundle prices for Straight & Body Wave (10-40 inches) in cents
const bundlePrices: Record<string, number> = {
  '10': 3000, '12': 3500, '14': 4000, '16': 4500, '18': 5500, '20': 6000,
  '22': 7500, '24': 8500, '26': 9500, '28': 10500, '30': 11500,
  '32': 13000, '34': 15000, '36': 16000, '38': 17000, '40': 19000,
};

// Curly bundle prices (+$10, only 10-30 inches)
const curlyBundlePrices: Record<string, number> = {
  '10': 4000, '12': 4500, '14': 5000, '16': 5500, '18': 6500, '20': 7000,
  '22': 8500, '24': 9500, '26': 10500, '28': 11500, '30': 12500,
};

// Frontal prices
const frontal13x4TPrices: Record<string, number> = {
  '12': 8500, '14': 9000, '16': 10500, '18': 11000, '20': 12000, '22': 12500, '24': 18000, '26': 19500,
};
const frontal13x4HDPrices: Record<string, number> = {
  '12': 11000, '14': 11500, '16': 12000, '18': 13000, '20': 14000, '22': 15500, '24': 20400, '26': 22400,
};
const frontal13x6TPrices: Record<string, number> = {
  '12': 10500, '14': 11000, '16': 12000, '18': 13400, '20': 15500, '22': 17000,
};
const frontal13x6HDPrices: Record<string, number> = {
  '12': 14000, '14': 15000, '16': 16000, '18': 17000, '20': 19000, '22': 20500,
};

async function main() {
  console.log('🌱 Seeding products with variant structure...');

  const products: any[] = [];

  // ============================================
  // BUNDLES - 3 Parent Products with variants
  // ============================================
  
  // 1. Straight Bundle
  products.push({
    name: 'Straight Bundle',
    slug: 'straight-bundle',
    description: 'Premium straight hair bundle in natural color. Luxurious, silky straight hair that blends seamlessly. Can be colored, curled, and styled as desired. Available in lengths from 10" to 40".',
    priceCents: 3000, // Starting price
    stock: 500,
    sku: 'BUNDLE-STRAIGHT',
    mainImageUrl: stockPhotos.straight,
    category: 'Bundles',
    variants: JSON.stringify({
      type: 'size',
      label: 'Length',
      options: Object.entries(bundlePrices).map(([size, price]) => ({
        value: `${size}"`,
        label: `${size} Inch`,
        priceCents: price,
      })),
    }),
    tags: ['bundle', 'straight', 'natural-color', 'hair-extension'],
  });

  // 2. Body Wave Bundle
  products.push({
    name: 'Body Wave Bundle',
    slug: 'body-wave-bundle',
    description: 'Premium body wave hair bundle in natural color. Beautiful, bouncy body wave texture with minimal shedding. Can be colored and heat styled. Available in lengths from 10" to 40".',
    priceCents: 3000,
    stock: 500,
    sku: 'BUNDLE-BODYWAVE',
    mainImageUrl: stockPhotos.bodyWave,
    category: 'Bundles',
    variants: JSON.stringify({
      type: 'size',
      label: 'Length',
      options: Object.entries(bundlePrices).map(([size, price]) => ({
        value: `${size}"`,
        label: `${size} Inch`,
        priceCents: price,
      })),
    }),
    tags: ['bundle', 'body-wave', 'natural-color', 'hair-extension'],
  });

  // 3. Curly Bundle
  products.push({
    name: 'Curly Bundle',
    slug: 'curly-bundle',
    description: 'Premium curly hair bundle in natural color. Gorgeous, defined curls that maintain their pattern after washing. Can be colored and styled. Available in lengths from 10" to 30".',
    priceCents: 4000,
    stock: 400,
    sku: 'BUNDLE-CURLY',
    mainImageUrl: stockPhotos.curly,
    category: 'Bundles',
    variants: JSON.stringify({
      type: 'size',
      label: 'Length',
      options: Object.entries(curlyBundlePrices).map(([size, price]) => ({
        value: `${size}"`,
        label: `${size} Inch`,
        priceCents: price,
      })),
    }),
    tags: ['bundle', 'curly', 'natural-color', 'hair-extension'],
  });

  // ============================================
  // FRONTALS - 4 Parent Products with size + texture variants
  // ============================================

  // 1. 13x4 Transparent Frontal
  products.push({
    name: '13x4 Transparent Lace Frontal',
    slug: '13x4-transparent-frontal',
    description: '13x4 transparent lace frontal that blends with all skin tones. Pre-plucked hairline with baby hairs. Choose your preferred length and texture.',
    priceCents: 8500,
    stock: 300,
    sku: 'FRONTAL-13X4-T',
    mainImageUrl: stockPhotos.frontal13x4T,
    category: 'Frontals',
    variants: JSON.stringify({
      type: 'multi',
      groups: [
        {
          type: 'texture',
          label: 'Texture',
          options: [
            { value: 'straight', label: 'Straight' },
            { value: 'body-wave', label: 'Body Wave' },
          ],
        },
        {
          type: 'size',
          label: 'Length',
          options: Object.entries(frontal13x4TPrices).map(([size, price]) => ({
            value: `${size}"`,
            label: `${size} Inch`,
            priceCents: price,
          })),
        },
      ],
    }),
    tags: ['frontal', '13x4', 'transparent', 'hair-extension'],
  });

  // 2. 13x4 HD Frontal
  products.push({
    name: '13x4 HD Lace Frontal',
    slug: '13x4-hd-frontal',
    description: '13x4 HD lace frontal with ultra-thin lace that melts into skin for undetectable results. Pre-plucked hairline. Choose your preferred length and texture.',
    priceCents: 11000,
    stock: 250,
    sku: 'FRONTAL-13X4-HD',
    mainImageUrl: stockPhotos.frontal13x4HD,
    category: 'Frontals',
    variants: JSON.stringify({
      type: 'multi',
      groups: [
        {
          type: 'texture',
          label: 'Texture',
          options: [
            { value: 'straight', label: 'Straight' },
            { value: 'body-wave', label: 'Body Wave' },
          ],
        },
        {
          type: 'size',
          label: 'Length',
          options: Object.entries(frontal13x4HDPrices).map(([size, price]) => ({
            value: `${size}"`,
            label: `${size} Inch`,
            priceCents: price,
          })),
        },
      ],
    }),
    tags: ['frontal', '13x4', 'hd', 'hair-extension'],
  });

  // 3. 13x6 Transparent Frontal
  products.push({
    name: '13x6 Transparent Lace Frontal',
    slug: '13x6-transparent-frontal',
    description: '13x6 transparent lace frontal with larger parting space for versatile styling. Pre-plucked with natural hairline. Choose your preferred length and texture.',
    priceCents: 10500,
    stock: 200,
    sku: 'FRONTAL-13X6-T',
    mainImageUrl: stockPhotos.frontal13x6T,
    category: 'Frontals',
    variants: JSON.stringify({
      type: 'multi',
      groups: [
        {
          type: 'texture',
          label: 'Texture',
          options: [
            { value: 'straight', label: 'Straight' },
            { value: 'body-wave', label: 'Body Wave' },
          ],
        },
        {
          type: 'size',
          label: 'Length',
          options: Object.entries(frontal13x6TPrices).map(([size, price]) => ({
            value: `${size}"`,
            label: `${size} Inch`,
            priceCents: price,
          })),
        },
      ],
    }),
    tags: ['frontal', '13x6', 'transparent', 'hair-extension'],
  });

  // 4. 13x6 HD Frontal
  products.push({
    name: '13x6 HD Lace Frontal',
    slug: '13x6-hd-frontal',
    description: '13x6 HD lace frontal with ultra-thin HD lace and extended parting space. Melts seamlessly for a flawless, undetectable look. Choose your preferred length and texture.',
    priceCents: 14000,
    stock: 150,
    sku: 'FRONTAL-13X6-HD',
    mainImageUrl: stockPhotos.frontal13x6HD,
    category: 'Frontals',
    variants: JSON.stringify({
      type: 'multi',
      groups: [
        {
          type: 'texture',
          label: 'Texture',
          options: [
            { value: 'straight', label: 'Straight' },
            { value: 'body-wave', label: 'Body Wave' },
          ],
        },
        {
          type: 'size',
          label: 'Length',
          options: Object.entries(frontal13x6HDPrices).map(([size, price]) => ({
            value: `${size}"`,
            label: `${size} Inch`,
            priceCents: price,
          })),
        },
      ],
    }),
    tags: ['frontal', '13x6', 'hd', 'hair-extension'],
  });

  // ============================================
  // CLOSURES - Placeholder
  // ============================================
  products.push({
    name: 'Lace Closure',
    slug: 'lace-closure',
    description: 'Premium lace closures coming soon. Check back for pricing and availability.',
    priceCents: 0,
    stock: 0,
    sku: 'CLOSURE-TBD',
    mainImageUrl: stockPhotos.closure,
    category: 'Closures',
    variants: null,
    tags: ['closure', 'coming-soon', 'hair-extension'],
    isActive: false,
  });

  // ============================================
  // LASHES - 6 Products
  // ============================================
  const lashProducts = [
    { name: 'Queen Mink Lashes', slug: 'queen-mink-lashes', desc: 'Luxurious 3D mink lashes for the ultimate glamorous look. Handcrafted with premium mink fur, lightweight and reusable up to 25 times.', priceCents: 2499, sku: 'LASH-001', tags: ['mink', 'luxury', 'bestseller'] },
    { name: 'Princess Faux Mink Set', slug: 'princess-faux-mink-set', desc: 'Cruelty-free faux mink lashes with stunning volume. Set includes 5 pairs from natural to dramatic styles. Vegan-friendly.', priceCents: 3499, sku: 'LASH-002', tags: ['faux-mink', 'set', 'vegan'] },
    { name: 'Natural Beauty Lashes', slug: 'natural-beauty-lashes', desc: 'Subtle, wispy lashes for an effortlessly natural look. Perfect for everyday wear, work, or a natural makeup look.', priceCents: 1499, sku: 'LASH-003', tags: ['natural', 'everyday', 'lightweight'] },
    { name: 'Drama Queen Volume', slug: 'drama-queen-volume-lashes', desc: 'Maximum volume and drama for those who love to stand out. Perfect for special events, photoshoots, and nights out.', priceCents: 2999, sku: 'LASH-004', tags: ['dramatic', 'volume', 'bold'] },
    { name: 'Magnetic Lash Kit', slug: 'magnetic-lash-kit', desc: 'Revolutionary magnetic lashes with magnetic eyeliner. No glue needed! Kit includes 2 pairs of magnetic lashes and magnetic eyeliner.', priceCents: 3999, sku: 'LASH-005', tags: ['magnetic', 'kit', 'easy-apply'] },
    { name: 'Wispy Cat Eye Lashes', slug: 'wispy-cat-eye-lashes', desc: 'Elongated outer corners for the perfect cat eye effect. Lightweight and comfortable for all-day wear.', priceCents: 1999, sku: 'LASH-006', tags: ['cat-eye', 'wispy', 'elegant'] },
  ];

  for (const lash of lashProducts) {
    products.push({
      name: lash.name,
      slug: lash.slug,
      description: lash.desc,
      priceCents: lash.priceCents,
      stock: 100,
      sku: lash.sku,
      mainImageUrl: stockPhotos.lashes,
      category: 'Lashes',
      variants: null,
      tags: ['lashes', ...lash.tags],
    });
  }

  // ============================================
  // ACCESSORIES - 6 Products
  // ============================================
  const accessoryProducts = [
    { name: 'Lash Adhesive - Strong Hold', slug: 'lash-adhesive-strong-hold', desc: 'Professional-grade lash adhesive. Waterproof, dries clear, latex-free. All-day hold for any occasion.', priceCents: 899, sku: 'ACC-001', tags: ['adhesive', 'waterproof'] },
    { name: 'Lash Applicator Tool', slug: 'lash-applicator-tool', desc: 'Precision lash applicator for perfect placement every time. Ergonomic rose gold design.', priceCents: 1299, sku: 'ACC-002', tags: ['tool', 'applicator'] },
    { name: 'Luxury Lash Storage Case', slug: 'luxury-lash-storage-case', desc: 'Elegant storage case for up to 10 pairs of lashes. Features a mirror inside the lid.', priceCents: 1999, sku: 'ACC-003', tags: ['storage', 'case', 'luxury'] },
    { name: 'Lash Serum - Growth Formula', slug: 'lash-serum-growth-formula', desc: 'Nourishing lash serum to promote natural lash growth and strength. See results in 4-6 weeks.', priceCents: 2999, sku: 'ACC-004', tags: ['serum', 'growth'] },
    { name: 'Eyelash Curler - Professional', slug: 'eyelash-curler-professional', desc: 'Professional-grade eyelash curler with silicone pads. Creates long-lasting curl without crimping.', priceCents: 1599, sku: 'ACC-005', tags: ['curler', 'tool'] },
    { name: 'Lash Remover Solution', slug: 'lash-remover-solution', desc: 'Gentle lash adhesive remover. Oil-based formula safe for sensitive eyes.', priceCents: 799, sku: 'ACC-006', tags: ['remover', 'gentle'] },
  ];

  for (const acc of accessoryProducts) {
    products.push({
      name: acc.name,
      slug: acc.slug,
      description: acc.desc,
      priceCents: acc.priceCents,
      stock: 200,
      sku: acc.sku,
      mainImageUrl: stockPhotos.accessories,
      category: 'Accessories',
      variants: null,
      tags: ['accessories', ...acc.tags],
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
        tags: product.variants ? [...product.tags, `variants:${product.variants}`] : product.tags,
        category: product.category,
        isActive: product.isActive !== false,
      },
    });
  }

  console.log('✅ Created products:');
  console.log('   📦 Bundles: 3 (Straight, Body Wave, Curly)');
  console.log('   📦 Frontals: 4 (13x4 T, 13x4 HD, 13x6 T, 13x6 HD)');
  console.log('   📦 Closures: 1 (placeholder)');
  console.log('   💄 Lashes: 6');
  console.log('   🛠️  Accessories: 6');
  console.log(`   Total: ${products.length} products`);
  console.log('');
  console.log('🎯 Each Hair Extension product has size/texture variants for customer selection!');

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
