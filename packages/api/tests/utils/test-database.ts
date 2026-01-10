import { PrismaClient } from '@myglambeauty/db';

export class TestDatabase {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/myglambeauty_test',
          },
        },
      });
    }
    return TestDatabase.instance;
  }

  static async connect(): Promise<void> {
    const db = TestDatabase.getInstance();
    await db.$connect();
  }

  static async disconnect(): Promise<void> {
    const db = TestDatabase.getInstance();
    await db.$disconnect();
  }

  static async reset(): Promise<void> {
    const db = TestDatabase.getInstance();
    
    // Clean up all tables in correct order to respect foreign key constraints
    const tablenames = await db.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await db.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
        } catch (error) {
          console.log(`Note: ${tablename} doesn't exist, skipping`);
        }
      }
    }
  }

  static async seedTestData(): Promise<void> {
    const db = TestDatabase.getInstance();

    // Create test user
    await db.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword',
        role: 'ADMIN',
      },
    });

    // Create test customer
    await db.customer.create({
      data: {
        email: 'customer@example.com',
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+1234567890',
      },
    });

    // Create test product
    await db.product.create({
      data: {
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product',
        priceCents: 2999,
        category: 'HAIR',
        isActive: true,
        stock: 10,
      },
    });

    // Create test booking
    const customer = await db.customer.findUnique({
      where: { email: 'customer@example.com' },
    });

    if (customer) {
      await db.booking.create({
        data: {
          customerId: customer.id,
          email: 'customer@example.com',
          name: 'Test Customer',
          phone: '+1234567890',
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          service: 'Test Service',
          source: 'WEBSITE',
          status: 'PENDING',
        },
      });
    }
  }

  static async cleanupTestData(): Promise<void> {
    await TestDatabase.reset();
  }
}

// Test data factory
export class TestDataFactory {
  static createUser(overrides: Partial<any> = {}) {
    return {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashedpassword',
      role: 'ADMIN',
      ...overrides,
    };
  }

  static createCustomer(overrides: Partial<any> = {}) {
    return {
      email: 'customer@example.com',
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+1234567890',
      ...overrides,
    };
  }

  static createProduct(overrides: Partial<any> = {}) {
    return {
      name: 'Test Product',
      slug: 'test-product',
      description: 'A test product',
      priceCents: 2999,
      category: 'HAIR',
      isActive: true,
      stock: 10,
      ...overrides,
    };
  }

  static createBooking(overrides: Partial<any> = {}) {
    return {
      email: 'customer@example.com',
      name: 'Test Customer',
      phone: '+1234567890',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      service: 'Test Service',
      source: 'WEBSITE',
      status: 'PENDING',
      ...overrides,
    };
  }
}
