import { prisma } from '@myglambeauty/db';
import { memoryCache } from '../../services/cache.service';

interface AnalyticsMetrics {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth: {
      monthly: number;
      weekly: number;
      daily: number;
    };
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    active: number;
  };
  products: {
    total: number;
    sold: number;
    revenue: number;
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  performance: {
    averageResponseTime: number;
    uptime: number;
    errorRate: number;
    requestsPerMinute: number;
  };
}

class AdvancedAnalyticsService {
  async getComprehensiveMetrics(): Promise<AnalyticsMetrics> {
    const cacheKey = 'comprehensive_metrics';
    const cached = memoryCache.get<AnalyticsMetrics>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Revenue metrics
    const revenueData = await this.getRevenueMetrics(oneDayAgo, oneWeekAgo, oneMonthAgo);
    
    // Booking metrics
    const bookingData = await this.getBookingMetrics();
    
    // Customer metrics
    const customerData = await this.getCustomerMetrics(oneDayAgo, oneMonthAgo);
    
    // Product metrics
    const productData = await this.getProductMetrics(oneMonthAgo);
    
    // Performance metrics (mock for now)
    const performanceData = {
      averageResponseTime: 245,
      uptime: 99.9,
      errorRate: 0.1,
      requestsPerMinute: 12.5,
    };

    const metrics: AnalyticsMetrics = {
      revenue: revenueData,
      bookings: bookingData,
      customers: customerData,
      products: productData,
      performance: performanceData,
    };

    // Cache for 5 minutes
    memoryCache.set(cacheKey, metrics, 5 * 60 * 1000);
    
    return metrics;
  }

  private async getRevenueMetrics(oneDayAgo: Date, oneWeekAgo: Date, oneMonthAgo: Date) {
    // Mock data for now - in real implementation, this would query actual orders/payments
    const total = 125990;
    const monthly = 45678;
    const weekly = 12450;
    const daily = 1780;

    // Calculate growth (mock data)
    const growth = {
      monthly: 15.3,
      weekly: 8.7,
      daily: 5.2,
    };

    return {
      total,
      monthly,
      weekly,
      daily,
      growth,
    };
  }

  private async getBookingMetrics() {
    const bookings = await prisma.booking.findMany({
      select: {
        status: true,
      },
    });

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    
    const conversionRate = total > 0 ? (confirmed / total) * 100 : 0;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  private async getCustomerMetrics(oneDayAgo: Date, oneMonthAgo: Date) {
    const totalCustomers = await prisma.customer.count();
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    // Mock data for returning/active customers
    const returning = Math.floor(totalCustomers * 0.7);
    const active = Math.floor(totalCustomers * 0.4);

    return {
      total: totalCustomers,
      new: newCustomers,
      returning,
      active,
    };
  }

  private async getProductMetrics(oneMonthAgo: Date) {
    const totalProducts = await prisma.product.count();
    
    // Mock data for sales metrics
    const sold = 156;
    const revenue = 45678;
    
    const topSelling = [
      {
        id: '1',
        name: '16IN LOOSE WAVE Bundle',
        sales: 45,
        revenue: 13499,
      },
      {
        id: '2',
        name: 'Lash Aftercare Kit',
        sales: 32,
        revenue: 14400,
      },
      {
        id: '3',
        name: 'Mink Lashes Set',
        sales: 28,
        revenue: 8399,
      },
    ];

    return {
      total: totalProducts,
      sold,
      revenue,
      topSelling,
    };
  }

  async getRealTimeMetrics() {
    const cacheKey = 'realtime_metrics';
    const cached = memoryCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Get current active users (mock)
    const activeUsers = Math.floor(Math.random() * 50) + 10;
    
    // Get recent activity (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    const metrics = {
      activeUsers,
      recentBookings,
      serverLoad: Math.random() * 100,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date(),
    };

    // Cache for 30 seconds
    memoryCache.set(cacheKey, metrics, 30 * 1000);
    
    return metrics;
  }

  async generateReport(type: 'daily' | 'weekly' | 'monthly') {
    const metrics = await this.getComprehensiveMetrics();
    
    const report = {
      type,
      generatedAt: new Date(),
      period: this.getPeriodDates(type),
      metrics,
      insights: this.generateInsights(metrics),
    };

    return report;
  }

  private getPeriodDates(type: 'daily' | 'weekly' | 'monthly') {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (type) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    return { start, end };
  }

  private generateInsights(metrics: AnalyticsMetrics) {
    const insights = [];

    // Revenue insights
    if (metrics.revenue.growth.monthly > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Revenue Growth',
        description: `Monthly revenue is up ${metrics.revenue.growth.monthly}%`,
      });
    }

    // Booking insights
    if (metrics.bookings.conversionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Low Booking Conversion',
        description: `Only ${metrics.bookings.conversionRate}% of bookings are confirmed`,
      });
    }

    // Customer insights
    if (metrics.customers.new > metrics.customers.returning * 0.5) {
      insights.push({
        type: 'positive',
        title: 'Growing Customer Base',
        description: 'New customer acquisition is strong',
      });
    }

    return insights;
  }
}

export const advancedAnalyticsService = new AdvancedAnalyticsService();
