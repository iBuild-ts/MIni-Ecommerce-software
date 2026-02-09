const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return res.json();
}

export interface Booking {
  id: string;
  service: {
    id: string;
    name: string;
    duration: string;
    price: string;
  };
  date: string;
  time: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  depositPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  bookings: {
    getAll: (params?: { status?: string; search?: string; limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());
      
      return fetchAPI<{ data: Booking[]; total: number; start: number; end: number }>(
        `/api/bookings?${searchParams.toString()}`
      );
    },
    getById: (id: string) =>
      fetchAPI<Booking>(`/api/bookings/${id}`),
    updateStatus: (id: string, status: string) =>
      fetchAPI<Booking>(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    update: (id: string, data: Partial<Booking>) =>
      fetchAPI<Booking>(`/api/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ message: string; booking: Booking }>(`/api/bookings/${id}`, {
        method: 'DELETE',
      }),
    getCalendar: (startDate?: string, endDate?: string) => {
      const searchParams = new URLSearchParams();
      if (startDate) searchParams.set('start', startDate);
      if (endDate) searchParams.set('end', endDate);
      
      return fetchAPI<any[]>(`/api/bookings/calendar?${searchParams.toString()}`);
    },
  },
  dashboard: {
    getStats: () => fetchAPI<any>('/api/dashboard/stats'),
    getRecentBookings: () => fetchAPI<any>('/api/dashboard/recent-bookings'),
    getRecentOrders: () => fetchAPI<any>('/api/dashboard/recent-orders'),
  },
};
