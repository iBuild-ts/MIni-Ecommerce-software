import { prisma } from '@myglambeauty/db';
import { AppError } from '../../middleware/errorHandler';

export class CustomerService {
  async getAll(options?: {
    search?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (options?.search) {
      where.OR = [
        { email: { contains: options.search, mode: 'insensitive' } },
        { firstName: { contains: options.search, mode: 'insensitive' } },
        { lastName: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.tags?.length) {
      where.marketingTags = { hasSome: options.tags };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: {
            select: { id: true, totalCents: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }

  async getById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          orderBy: { scheduledFor: 'desc' },
        },
        aiConversations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const totalSpent = await prisma.order.aggregate({
      where: { customerId: id, isPaid: true },
      _sum: { totalCents: true },
    });

    return {
      ...customer,
      totalSpent: totalSpent._sum.totalCents || 0,
    };
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    newsletterOptIn?: boolean;
    marketingTags?: string[];
  }) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async addTag(id: string, tag: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    if (customer.marketingTags.includes(tag)) {
      return customer;
    }

    return prisma.customer.update({
      where: { id },
      data: {
        marketingTags: { push: tag },
      },
    });
  }

  async removeTag(id: string, tag: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.customer.update({
      where: { id },
      data: {
        marketingTags: customer.marketingTags.filter((t) => t !== tag),
      },
    });
  }

  async getStats() {
    const [total, withOrders, newsletterOptIn] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { orders: { some: {} } } }),
      prisma.customer.count({ where: { newsletterOptIn: true } }),
    ]);

    return { total, withOrders, newsletterOptIn };
  }
}

export const customerService = new CustomerService();
