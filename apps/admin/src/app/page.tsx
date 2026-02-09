'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  // Mock data for now - will be replaced with real API calls
  const stats = {
    totalBookings: 156,
    totalRevenue: 45678,
    activeCustomers: 89,
    totalOrders: 234,
    monthlyGrowth: 12,
    todayBookings: 8,
    todayRevenue: 1234,
    pendingBookings: 12
  };

  const recentBookings = [
    {
      id: '1',
      service: { name: 'HD Lace Frontal Installation' },
      customer: { name: 'Sarah Johnson' },
      date: '2024-02-08',
      time: '10:00 AM',
      status: 'confirmed',
      depositPaid: true
    },
    {
      id: '2',
      service: { name: 'Hair Coloring' },
      customer: { name: 'Maria Garcia' },
      date: '2024-02-08',
      time: '2:00 PM',
      status: 'pending',
      depositPaid: false
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: { firstName: 'John', lastName: 'Smith' },
      createdAt: '2024-02-08T10:30:00Z',
      items: [
        { productName: 'Brazilian Hair Bundle' }
      ],
      status: 'PAID',
      totalCents: 29999
    },
    {
      id: 'ORD-002',
      customer: { firstName: 'Emily', lastName: 'Davis' },
      createdAt: '2024-02-08T09:15:00Z',
      items: [
        { productName: 'Lace Closure' }
      ],
      status: 'SHIPPED',
      totalCents: 14999
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MYGlamBeauty Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's your business overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Link href="/bookings">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+{stats.monthlyGrowth}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</h3>
            <p className="text-sm text-gray-600">Active Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="text-sm text-gray-600">Product Orders</p>
          </div>
        </motion.div>

        {/* Today's Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Bookings</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.todayBookings}</p>
            <p className="text-sm text-gray-600">Appointments scheduled</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Revenue</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(stats.todayRevenue)}</p>
            <p className="text-sm text-gray-600">Expected earnings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingBookings}</p>
            <p className="text-sm text-gray-600">Bookings awaiting confirmation</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <Link href="/bookings">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.service.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">{booking.customer.name}</p>
                        <p className="text-sm text-gray-600">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.depositPaid && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalCents)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/products/new">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/customers">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Manage Orders
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
