'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  ShoppingBag,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; revenue: number; bookings: number }>;
  };
  bookings: {
    total: number;
    growth: number;
    byStatus: Array<{ status: string; count: number }>;
    byService: Array<{ service: string; count: number; revenue: number }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  products: {
    total: number;
    topSelling: Array<{ name: string; sales: number; revenue: number }>;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock analytics data - in real app, this would be an API call
      const mockData: AnalyticsData = {
        revenue: {
          total: 45678,
          growth: 15.3,
          monthly: [
            { month: 'Jan', revenue: 12000, bookings: 45 },
            { month: 'Feb', revenue: 13500, bookings: 52 },
            { month: 'Mar', revenue: 14200, bookings: 58 },
            { month: 'Apr', revenue: 15978, bookings: 67 },
          ],
        },
        bookings: {
          total: 156,
          growth: 12.5,
          byStatus: [
            { status: 'confirmed', count: 89 },
            { status: 'pending', count: 23 },
            { status: 'completed', count: 134 },
            { status: 'cancelled', count: 12 },
          ],
          byService: [
            { service: 'Sew-in Special', count: 45, revenue: 11250 },
            { service: 'Lash Lift & Tint', count: 38, revenue: 4560 },
            { service: 'Deep Conditioning', count: 28, revenue: 2380 },
            { service: 'Hair Treatment', count: 22, revenue: 1980 },
          ],
        },
        customers: {
          total: 234,
          new: 67,
          returning: 167,
          growth: 8.2,
        },
        products: {
          total: 89,
          topSelling: [
            { name: '16IN LOOSE WAVE Bundle', sales: 45, revenue: 13499 },
            { name: 'Lash Aftercare Kit', sales: 32, revenue: 14400 },
            { name: 'Mink Lashes Set', sales: 28, revenue: 8399 },
            { name: 'Hair Growth Serum', sales: 22, revenue: 6599 },
          ],
        },
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
          <Button onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-600">Track your business performance and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                  </button>
                ))}
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                data.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.revenue.growth > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPercent(data.revenue.growth)}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(data.revenue.total)}</h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                data.bookings.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.bookings.growth > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPercent(data.bookings.growth)}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data.bookings.total}</h3>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                data.customers.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.customers.growth > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPercent(data.customers.growth)}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data.customers.total}</h3>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-gray-600">
                {data.products.total} Products
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{data.products.total}</h3>
            <p className="text-sm text-gray-600">Product Orders</p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {data.revenue.monthly.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-brand-500 rounded-t-lg relative" style={{ height: `${(month.revenue / Math.max(...data.revenue.monthly.map(m => m.revenue))) * 100}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700">
                      {formatCurrency(month.revenue)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{month.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Booking Status</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.bookings.byStatus.map((status) => {
                const percentage = (status.count / data.bookings.total) * 100;
                const color = status.status === 'confirmed' ? 'bg-green-500' : 
                             status.status === 'pending' ? 'bg-yellow-500' : 
                             status.status === 'completed' ? 'bg-blue-500' : 'bg-red-500';
                
                return (
                  <div key={status.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">{status.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{status.count}</span>
                      <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Service Performance & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.bookings.byService.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-sm font-bold text-brand-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.service}</p>
                      <p className="text-xs text-gray-500">{service.count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(service.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <ShoppingBag className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.products.topSelling.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
