'use client';

import { useState } from 'react';
import { Search, Plus, Mail, Phone, Tag, Calendar, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge';

const demoLeads = [
  { id: '1', name: 'Jennifer Lopez', email: 'jennifer@email.com', phone: '+1 555-0201', source: 'website', status: 'new', tags: ['interested-lashes'], createdAt: '2024-01-15' },
  { id: '2', name: 'Taylor Swift', email: 'taylor@email.com', phone: '+1 555-0202', source: 'instagram', status: 'contacted', tags: ['influencer'], createdAt: '2024-01-14' },
  { id: '3', name: 'Beyonce Knowles', email: 'beyonce@email.com', phone: '+1 555-0203', source: 'referral', status: 'qualified', tags: ['high-value'], createdAt: '2024-01-13' },
  { id: '4', name: 'Rihanna Fenty', email: 'rihanna@email.com', phone: '+1 555-0204', source: 'ai_chat', status: 'new', tags: ['booking-inquiry'], createdAt: '2024-01-12' },
  { id: '5', name: 'Ariana Grande', email: 'ariana@email.com', phone: '+1 555-0205', source: 'newsletter', status: 'converted', tags: ['repeat'], createdAt: '2024-01-10' },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary' }> = {
  new: { label: 'New', variant: 'default' },
  contacted: { label: 'Contacted', variant: 'warning' },
  qualified: { label: 'Qualified', variant: 'secondary' },
  converted: { label: 'Converted', variant: 'success' },
  lost: { label: 'Lost', variant: 'danger' },
};

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = demoLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: demoLeads.length,
    new: demoLeads.filter((l) => l.status === 'new').length,
    qualified: demoLeads.filter((l) => l.status === 'qualified').length,
    converted: demoLeads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">Track and convert potential customers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-400">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">New</p>
          <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Qualified</p>
          <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Converted</p>
          <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search leads..."
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
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-500">
          <option>All Sources</option>
          <option>Website</option>
          <option>Instagram</option>
          <option>AI Chat</option>
          <option>Referral</option>
          <option>Newsletter</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Lead</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Source</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tags</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Created</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                        {lead.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-600">{lead.source.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      {lead.status !== 'converted' && (
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Convert
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
