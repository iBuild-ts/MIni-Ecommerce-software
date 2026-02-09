'use client';

import { useState } from 'react';
import { Search, Plus, Mail, Phone, ShoppingBag, Calendar, MoreVertical } from 'lucide-react';
import { Button, formatPrice } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const demoCustomers = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0101', orders: 12, totalSpent: 45999, tags: ['VIP', 'Repeat'], lastOrder: '2024-01-15' },
  { id: '2', name: 'Michelle Williams', email: 'michelle@email.com', phone: '+1 555-0102', orders: 8, totalSpent: 32499, tags: ['Repeat'], lastOrder: '2024-01-14' },
  { id: '3', name: 'Jessica Davis', email: 'jessica@email.com', phone: '+1 555-0103', orders: 5, totalSpent: 18999, tags: [], lastOrder: '2024-01-12' },
  { id: '4', name: 'Amanda Brown', email: 'amanda@email.com', phone: '+1 555-0104', orders: 3, totalSpent: 8999, tags: ['New'], lastOrder: '2024-01-10' },
  { id: '5', name: 'Emily Wilson', email: 'emily@email.com', phone: '+1 555-0105', orders: 15, totalSpent: 62499, tags: ['VIP', 'Influencer'], lastOrder: '2024-01-08' },
  { id: '6', name: 'Rachel Green', email: 'rachel@email.com', phone: '+1 555-0106', orders: 1, totalSpent: 2499, tags: ['New'], lastOrder: '2024-01-05' },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = demoCustomers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">Manage your customer relationships</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: demoCustomers.length },
          { label: 'VIP Customers', value: demoCustomers.filter((c) => c.tags.includes('VIP')).length },
          { label: 'New This Month', value: demoCustomers.filter((c) => c.tags.includes('New')).length },
          { label: 'Avg. Order Value', value: formatPrice(Math.round(demoCustomers.reduce((a, c) => a + c.totalSpent / c.orders, 0) / demoCustomers.length)) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
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
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500">
          <option>All Tags</option>
          <option>VIP</option>
          <option>Repeat</option>
          <option>New</option>
          <option>Influencer</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-lg">
                  {customer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {customer.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tag === 'VIP' ? 'gold' : tag === 'Influencer' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <ShoppingBag className="h-3 w-3" />
                </div>
                <p className="font-semibold text-gray-900">{customer.orders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{formatPrice(customer.totalSpent)}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Calendar className="h-3 w-3" />
                </div>
                <p className="font-semibold text-gray-900">{customer.lastOrder}</p>
                <p className="text-xs text-gray-500">Last Order</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button size="sm" className="flex-1">View Profile</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
