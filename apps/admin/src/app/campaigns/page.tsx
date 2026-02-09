'use client';

import { useState } from 'react';
import { Plus, Search, Mail, Send, Calendar, Users, TrendingUp, MoreVertical, Edit, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const demoCampaigns = [
  {
    id: '1',
    name: 'Summer Glam Collection',
    type: 'email',
    status: 'active',
    sent: 2500,
    opens: 1875,
    clicks: 225,
    revenue: 12499,
    scheduled: '2024-01-20',
    created: '2024-01-15',
  },
  {
    id: '2',
    name: 'New Lash Arrival',
    type: 'sms',
    status: 'scheduled',
    sent: 0,
    opens: 0,
    clicks: 0,
    revenue: 0,
    scheduled: '2024-01-25',
    created: '2024-01-18',
  },
  {
    id: '3',
    name: 'VIP Customer Exclusive',
    type: 'email',
    status: 'completed',
    sent: 500,
    opens: 425,
    clicks: 85,
    revenue: 8999,
    scheduled: '2024-01-10',
    created: '2024-01-08',
  },
  {
    id: '4',
    name: 'Flash Sale - 24 Hours',
    type: 'push',
    status: 'draft',
    sent: 0,
    opens: 0,
    clicks: 0,
    revenue: 0,
    scheduled: null,
    created: '2024-01-19',
  },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary' }> = {
  active: { label: 'Active', variant: 'success' },
  scheduled: { label: 'Scheduled', variant: 'warning' },
  completed: { label: 'Completed', variant: 'secondary' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Paused', variant: 'danger' },
};

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCampaigns = demoCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: demoCampaigns.length,
    active: demoCampaigns.filter((c) => c.status === 'active').length,
    scheduled: demoCampaigns.filter((c) => c.status === 'scheduled').length,
    totalRevenue: demoCampaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalSent: demoCampaigns.reduce((sum, c) => sum + c.sent, 0),
    avgOpenRate: demoCampaigns.filter(c => c.sent > 0).reduce((sum, c) => sum + (c.opens / c.sent), 0) / demoCampaigns.filter(c => c.sent > 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500">Manage email, SMS, and push notification campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Mail className="h-5 w-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">campaigns</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Send className="h-5 w-5" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          <p className="text-sm text-gray-500">running</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
          <p className="text-sm text-gray-500">upcoming</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Sent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
          <p className="text-sm text-gray-500">messages</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue / 100).toFixed(0)}</p>
          <p className="text-sm text-gray-500">generated</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search campaigns..."
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
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Types</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Campaign</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Performance</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Revenue</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Schedule</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCampaigns.map((campaign) => {
              const status = statusConfig[campaign.status];
              const openRate = campaign.sent > 0 ? ((campaign.opens / campaign.sent) * 100).toFixed(1) : '0';
              const clickRate = campaign.opens > 0 ? ((campaign.clicks / campaign.opens) * 100).toFixed(1) : '0';
              
              return (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">Created {campaign.created}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-600">{campaign.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      status.variant === 'success' ? 'bg-green-100 text-green-800' :
                      status.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      status.variant === 'secondary' ? 'bg-gray-100 text-gray-800' :
                      status.variant === 'danger' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p>{campaign.sent.toLocaleString()} sent</p>
                      <p className="text-gray-500">{openRate}% open rate</p>
                      <p className="text-gray-500">{clickRate}% click rate</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${(campaign.revenue / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {campaign.scheduled || 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status === 'active' && (
                        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Pause">
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Resume">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredCampaigns.length} of {demoCampaigns.length} campaigns
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
