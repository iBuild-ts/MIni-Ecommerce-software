'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button, formatPrice, formatDateTime } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge';

const demoOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', email: 'sarah@email.com', totalCents: 4999, status: 'completed', items: 2, createdAt: '2024-01-15T10:30:00Z' },
  { id: 'ORD-002', customer: 'Michelle Williams', email: 'michelle@email.com', totalCents: 2499, status: 'processing', items: 1, createdAt: '2024-01-15T09:15:00Z' },
  { id: 'ORD-003', customer: 'Jessica Davis', email: 'jessica@email.com', totalCents: 7499, status: 'pending', items: 3, createdAt: '2024-01-14T16:45:00Z' },
  { id: 'ORD-004', customer: 'Amanda Brown', email: 'amanda@email.com', totalCents: 1499, status: 'completed', items: 1, createdAt: '2024-01-14T14:20:00Z' },
  { id: 'ORD-005', customer: 'Emily Wilson', email: 'emily@email.com', totalCents: 3999, status: 'shipped', items: 2, createdAt: '2024-01-13T11:00:00Z' },
  { id: 'ORD-006', customer: 'Rachel Green', email: 'rachel@email.com', totalCents: 5999, status: 'cancelled', items: 2, createdAt: '2024-01-12T08:30:00Z' },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary'; icon: any }> = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  processing: { label: 'Processing', variant: 'default', icon: Package },
  shipped: { label: 'Shipped', variant: 'secondary', icon: Truck },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'danger', icon: XCircle },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = demoOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: demoOrders.length,
    pending: demoOrders.filter((o) => o.status === 'pending').length,
    processing: demoOrders.filter((o) => o.status === 'processing').length,
    completed: demoOrders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">Manage and fulfill customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, color: 'bg-gray-100' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-100' },
          { label: 'Processing', value: stats.processing, color: 'bg-blue-100' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-100' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Items</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-brand-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.items} items</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.totalCents)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={status.variant} className="inline-flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {order.status === 'pending' && (
                        <Button size="sm">Process</Button>
                      )}
                      {order.status === 'processing' && (
                        <Button size="sm">Ship</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {demoOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
