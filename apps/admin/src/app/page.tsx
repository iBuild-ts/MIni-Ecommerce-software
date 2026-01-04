'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, formatPrice } from '@myglambeauty/ui';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$12,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    title: 'Customers',
    value: '2,340',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-0.4%',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', total: 4999, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Michelle Williams', total: 2499, status: 'processing', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Jessica Davis', total: 7499, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Amanda Brown', total: 1499, status: 'completed', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Emily Wilson', total: 3999, status: 'shipped', date: '2024-01-13' },
];

const topProducts = [
  { name: 'Queen Mink Lashes', sales: 145, revenue: 362355 },
  { name: 'Princess Faux Mink Set', sales: 98, revenue: 342902 },
  { name: 'Natural Beauty Lashes', sales: 87, revenue: 130413 },
  { name: 'Drama Queen Volume', sales: 76, revenue: 227924 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-brand-600">{order.id}</td>
                      <td className="py-3 px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-4 text-sm font-medium">{formatPrice(order.total)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-sm font-bold text-brand-600">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Product', icon: Package, href: '/products/new' },
          { label: 'View Orders', icon: ShoppingCart, href: '/orders' },
          { label: 'Manage Bookings', icon: Calendar, href: '/bookings' },
          { label: 'Send Campaign', icon: DollarSign, href: '/campaigns' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all"
          >
            <action.icon className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
