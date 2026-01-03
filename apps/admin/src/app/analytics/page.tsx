'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, Calendar, Download } from 'lucide-react';
import { Button } from '@myglambeauty/ui';

const demoData = {
  overview: {
    totalRevenue: 125990,
    revenueGrowth: 12.5,
    totalOrders: 847,
    ordersGrowth: 8.3,
    totalCustomers: 2341,
    customersGrowth: 15.2,
    conversionRate: 3.2,
    conversionGrowth: 0.5,
    avgOrderValue: 148.65,
    aovGrowth: 3.8,
  },
  salesChart: [
    { date: '2024-01-01', revenue: 12500, orders: 85 },
    { date: '2024-01-02', revenue: 15200, orders: 102 },
    { date: '2024-01-03', revenue: 18900, orders: 127 },
    { date: '2024-01-04', revenue: 16800, orders: 113 },
    { date: '2024-01-05', revenue: 22100, orders: 148 },
    { date: '2024-01-06', revenue: 19500, orders: 131 },
    { date: '2024-01-07', revenue: 20990, orders: 141 },
  ],
  topProducts: [
    { name: 'Queen Mink Lashes', revenue: 28990, units: 1160, growth: 15.2 },
    { name: 'Princess Faux Mink Set', revenue: 24450, units: 699, growth: 8.7 },
    { name: 'Natural Beauty Lashes', revenue: 18750, units: 1250, growth: -2.3 },
    { name: 'Drama Queen Volume', revenue: 22100, units: 737, growth: 22.1 },
    { name: 'Magnetic Lash Kit', revenue: 31700, units: 793, growth: 45.6 },
  ],
  trafficSources: [
    { source: 'Direct', visitors: 3421, percentage: 35.2, conversion: 4.1 },
    { source: 'Social Media', visitors: 2856, percentage: 29.4, conversion: 3.8 },
    { source: 'Search', visitors: 1876, percentage: 19.3, conversion: 2.9 },
    { source: 'Email', visitors: 987, percentage: 10.2, conversion: 6.2 },
    { source: 'Referral', visitors: 567, percentage: 5.9, conversion: 2.1 },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
    { value: 'conversion', label: 'Conversion Rate' },
  ];

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              demoData.overview.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {demoData.overview.revenueGrowth > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(demoData.overview.revenueGrowth)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(demoData.overview.totalRevenue)}
          </h3>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              demoData.overview.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {demoData.overview.ordersGrowth > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(demoData.overview.ordersGrowth)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(demoData.overview.totalOrders)}
          </h3>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              demoData.overview.customersGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {demoData.overview.customersGrowth > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(demoData.overview.customersGrowth)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(demoData.overview.totalCustomers)}
          </h3>
          <p className="text-sm text-gray-500">Total Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-brand-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              demoData.overview.conversionGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {demoData.overview.conversionGrowth > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(demoData.overview.conversionGrowth)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {demoData.overview.conversionRate}%
          </h3>
          <p className="text-sm text-gray-500">Conversion Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <div className="flex gap-2">
              {metrics.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => setSelectedMetric(metric.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric.value
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-full gap-2">
              {demoData.salesChart.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-brand-500 rounded-t" style={{ height: `${(day.revenue / 25000) * 100}%` }} />
                  <span className="text-xs text-gray-500">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {demoData.trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{source.source}</span>
                  <span className="text-gray-500">{source.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatNumber(source.visitors)} visitors</span>
                  <span>{source.conversion}% conv.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Revenue</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Units Sold</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Growth</th>
              </tr>
            </thead>
            <tbody>
              {demoData.topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 text-sm text-right font-medium">{formatCurrency(product.revenue)}</td>
                  <td className="py-3 text-sm text-right text-gray-500">{formatNumber(product.units)}</td>
                  <td className="py-3 text-sm text-right">
                    <span className={`inline-flex items-center gap-1 ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
