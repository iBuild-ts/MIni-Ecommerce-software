import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@myglambeauty.com' },
    update: {},
    create: {
      email: 'admin@myglambeauty.com',
      name: 'Admin',
      role: 'SUPER_ADMIN',
      passwordHash,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create demo products - Luxury Lashes
  const products = [
    {
      name: 'Queen Mink Lashes',
      slug: 'queen-mink-lashes',
      description: 'Luxurious 3D mink lashes for the ultimate glamorous look. Handcrafted with premium mink fur, these lashes are lightweight, fluffy, and reusable up to 25 times with proper care. Perfect for special occasions or everyday glam.',
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
      description: 'Cruelty-free faux mink lashes that deliver stunning volume without compromising on ethics. This set includes 5 pairs of varying styles from natural to dramatic. Vegan-friendly and perfect for lash lovers.',
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
      description: 'Subtle, wispy lashes for an effortlessly natural look. These lightweight lashes enhance your eyes without being too dramatic. Perfect for everyday wear, work, or a natural makeup look.',
      priceCents: 1499,
      stock: 300,
      sku: 'LASH-NATURAL-003',
      mainImageUrl: 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?w=800',
      tags: ['natural', 'everyday', 'lightweight', 'beginner-friendly'],
      category: 'Lashes',
    },
    {
      name: 'Drama Queen Volume Lashes',
      slug: 'drama-queen-volume-lashes',
      description: 'Maximum volume and drama for those who love to stand out. These bold, full lashes create an intense, eye-catching look perfect for nights out, photoshoots, and special events.',
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
      description: 'Revolutionary magnetic lashes with magnetic eyeliner. No glue needed! Easy application and removal. Kit includes 2 pairs of magnetic lashes and magnetic eyeliner. Perfect for beginners.',
      priceCents: 3999,
      stock: 80,
      sku: 'LASH-MAG-005',
      mainImageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800',
      tags: ['magnetic', 'kit', 'easy-apply', 'beginner-friendly'],
      category: 'Lashes',
    },
    {
      name: 'Lash Adhesive - Strong Hold',
      slug: 'lash-adhesive-strong-hold',
      description: 'Professional-grade lash adhesive that keeps your lashes secure all day and night. Waterproof formula, dries clear, and gentle on sensitive eyes. Latex-free.',
      priceCents: 899,
      stock: 500,
      sku: 'ACC-GLUE-001',
      mainImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      tags: ['adhesive', 'waterproof', 'latex-free', 'essential'],
      category: 'Accessories',
    },
    {
      name: 'Lash Applicator Tool',
      slug: 'lash-applicator-tool',
      description: 'Precision lash applicator for perfect placement every time. Ergonomic design makes applying false lashes easy, even for beginners. Rose gold finish.',
      priceCents: 1299,
      stock: 250,
      sku: 'ACC-TOOL-002',
      mainImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      tags: ['tool', 'applicator', 'rose-gold', 'essential'],
      category: 'Accessories',
    },
    {
      name: 'Luxury Lash Storage Case',
      slug: 'luxury-lash-storage-case',
      description: 'Keep your precious lashes safe and organized in this elegant storage case. Holds up to 10 pairs of lashes. Features a mirror inside the lid. Available in pink and black.',
      priceCents: 1999,
      stock: 120,
      sku: 'ACC-CASE-003',
      mainImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
      tags: ['storage', 'case', 'luxury', 'organization'],
      category: 'Accessories',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log('✅ Created', products.length, 'products');

  // Create demo customers
  const customers = [
    {
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567890',
      newsletterOptIn: true,
      marketingTags: ['vip', 'repeat-buyer'],
    },
    {
      email: 'michelle@example.com',
      firstName: 'Michelle',
      lastName: 'Williams',
      phone: '+1234567891',
      newsletterOptIn: true,
      marketingTags: ['new-customer'],
    },
    {
      email: 'jessica@example.com',
      firstName: 'Jessica',
      lastName: 'Davis',
      phone: '+1234567892',
      newsletterOptIn: false,
      marketingTags: ['high-aov'],
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: customer,
      create: customer,
    });
  }
  console.log('✅ Created', customers.length, 'customers');

  // Create demo leads
  const leads = [
    { email: 'lead1@example.com', name: 'Emily', source: 'newsletter_form', tags: ['instagram'] },
    { email: 'lead2@example.com', name: 'Ashley', source: 'exit_popup', tags: ['tiktok'] },
    { email: 'lead3@example.com', name: 'Brittany', source: 'ai_chat', tags: ['interested-lashes'] },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }
  console.log('✅ Created', leads.length, 'leads');

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
