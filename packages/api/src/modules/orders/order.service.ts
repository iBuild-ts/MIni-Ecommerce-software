import { prisma, OrderStatus } from '@myglambeauty/db';
import { stripe } from '../../config/stripe';
import { AppError } from '../../middleware/errorHandler';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutData {
  items: CartItem[];
  customerEmail: string;
  customerName?: string;
  shippingAddress?: any;
  billingAddress?: any;
}

export class OrderService {
  async createCheckout(data: CheckoutData) {
    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    const lineItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      if (!product.isActive) {
        throw new AppError(`Product ${product.name} is not available`, 400);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        totalCents: product.priceCents * item.quantity,
      };
    });

    const subtotalCents = lineItems.reduce((sum, item) => sum + item.totalCents, 0);
    const totalCents = subtotalCents;

    let customer = await prisma.customer.findUnique({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: data.customerEmail,
          firstName: data.customerName?.split(' ')[0],
          lastName: data.customerName?.split(' ').slice(1).join(' '),
        },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      metadata: {
        customerEmail: data.customerEmail,
      },
    });

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        status: 'PENDING',
        subtotalCents,
        totalCents,
        stripePaymentIntent: paymentIntent.id,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        items: {
          create: lineItems,
        },
      },
      include: { items: true },
    });

    return {
      order,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    const order = await prisma.order.findUnique({
      where: { stripePaymentIntent: paymentIntentId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    for (const item of order.items) {
      await prisma.$transaction([
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
        prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -item.quantity,
            reason: 'ORDER',
          },
        }),
      ]);
    }

    return prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID', isPaid: true },
      include: { items: true, customer: true },
    });
  }

  async getAll(options?: {
    status?: OrderStatus;
    customerId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (options?.status) where.status = options.status;
    if (options?.customerId) where.customerId = options.customerId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, customer: true },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, customer: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, customer: true },
    });
  }

  async getStats() {
    const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: { isPaid: true },
        _sum: { totalCents: true },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalCents || 0,
      ordersByStatus,
    };
  }

  async getByCustomerEmail(email: string) {
    if (!email) {
      return { orders: [] };
    }

    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return { orders: [] };
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: { items: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return { orders };
  }
}

export const orderService = new OrderService();
