'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Clock, User, Mail, Phone, Check, X, AlertCircle } from 'lucide-react';
import { Button, Badge } from '@myglambeauty/ui';
import { adminApi, Booking } from '@/lib/api';

const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.bookings.getAll();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const updatedBooking = await adminApi.bookings.updateStatus(bookingId, status);
      setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await adminApi.bookings.delete(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === today && b.status !== 'cancelled');
  const upcomingBookings = bookings.filter((b) => b.date > today && b.status !== 'cancelled');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500">Manage appointments and consultations</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage appointments and consultations</p>
        </div>
        <Button onClick={fetchBookings}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
          <p className="text-sm text-gray-500">appointments</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Upcoming</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
          <p className="text-sm text-gray-500">scheduled</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{bookings.filter((b) => b.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">to confirm</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{bookings.filter((b) => b.status === 'completed').length}</p>
          <p className="text-sm text-gray-500">this week</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search bookings..."
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
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium ${view === 'list' ? 'bg-brand-500 text-white' : 'bg-white text-gray-700'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 text-sm font-medium ${view === 'calendar' ? 'bg-brand-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date & Time</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Notes</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {booking.customer.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900 font-medium">{booking.service.name}</p>
                      <p className="text-sm text-gray-500">{booking.service.duration} • {booking.service.price}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(booking.date)}</span>
                      <Clock className="h-4 w-4 text-gray-400 ml-2" />
                      <span>{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {booking.depositPaid && (
                        <Badge variant="success" className="text-xs">Deposit</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.customer.notes || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No bookings found</div>
          </div>
        )}
      </div>
    </div>
  );
}
