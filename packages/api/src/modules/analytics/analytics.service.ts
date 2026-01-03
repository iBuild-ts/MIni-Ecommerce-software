import { prisma } from '@myglambeauty/db';

export class AnalyticsService {
  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      totalOrders,
      monthlyOrders,
      totalCustomers,
      newCustomers,
      totalProducts,
      lowStockProducts,
      totalLeads,
      pendingBookings,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { isPaid: true },
        _sum: { totalCents: true },
      }),
      prisma.order.aggregate({
        where: { isPaid: true, createdAt: { gte: thirtyDaysAgo } },
        _sum: { totalCents: true },
      }),
      prisma.order.aggregate({
        where: { isPaid: true, createdAt: { gte: sevenDaysAgo } },
        _sum: { totalCents: true },
      }),
      prisma.order.count({ where: { isPaid: true } }),
      prisma.order.count({ where: { isPaid: true, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 10 } } }),
      prisma.lead.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      revenue: {
        total: totalRevenue._sum.totalCents || 0,
        monthly: monthlyRevenue._sum.totalCents || 0,
        weekly: weeklyRevenue._sum.totalCents || 0,
      },
      orders: {
        total: totalOrders,
        monthly: monthlyOrders,
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      leads: totalLeads,
      pendingBookings,
    };
  }

  async getSalesChart(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        isPaid: true,
        createdAt: { gte: startDate },
      },
      select: {
        totalCents: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const salesByDay: Record<string, number> = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const key = date.toISOString().split('T')[0];
      salesByDay[key] = 0;
    }

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().split('T')[0];
      if (salesByDay[key] !== undefined) {
        salesByDay[key] += order.totalCents;
      }
    });

    return Object.entries(salesByDay).map(([date, amount]) => ({
      date,
      amount,
    }));
  }

  async getTopProducts(limit: number = 10) {
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, totalCents: true },
      orderBy: { _sum: { totalCents: 'desc' } },
      take: limit,
    });

    const productIds = orderItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    return orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        product,
        totalQuantity: item._sum.quantity || 0,
        totalRevenue: item._sum.totalCents || 0,
      };
    });
  }

  async getRecentOrders(limit: number = 10) {
    return prisma.order.findMany({
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getConversionRate() {
    const [totalLeads, convertedLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.customer.count({ where: { orders: { some: {} } } }),
    ]);

    return {
      totalLeads,
      convertedLeads,
      rate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    };
  }
}

export const analyticsService = new AnalyticsService();
