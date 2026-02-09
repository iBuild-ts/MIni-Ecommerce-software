const API_URL = 'https://mini-ecommerce-software.onrender.com';

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

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  isActive: boolean;
  stock: number;
  sku?: string;
  mainImageUrl?: string;
  videoUrl?: string;
  tags: string[];
  category?: string;
  galleryImages: Array<{ id: string; url: string; alt?: string }>;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI<{ token: string; user: { id: string; email: string; name: string; role: string } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, name?: string) =>
      fetchAPI<{ token: string; user: { id: string; email: string; name: string; role: string } }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    getProfile: () =>
      fetchAPI<{ id: string; email: string; name: string; role: string; createdAt: string }>('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
    updateProfile: (data: { name?: string; phone?: string }) =>
      fetchAPI<{ id: string; email: string; name: string; role: string; createdAt: string }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
    forgotPassword: (email: string) =>
      fetchAPI<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (token: string, newPassword: string) =>
      fetchAPI<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
    changePassword: (currentPassword: string, newPassword: string) =>
      fetchAPI<{ message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
  },
  products: {
    getAll: (params?: { category?: string; search?: string; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      searchParams.set('isActive', 'true');
      return fetchAPI<{ products: Product[]; total: number }>(
        `/api/products?${searchParams.toString()}`
      );
    },
    getBySlug: (slug: string) =>
      fetchAPI<Product>(`/api/products/slug/${slug}`),
  },
  leads: {
    create: (data: { email: string; name?: string; source?: string }) =>
      fetchAPI('/api/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  bookings: {
    create: (data: {
      service: {
        id: string;
        name: string;
        duration: string;
        price: string;
        category?: string;
        description?: string;
        deposit?: string;
        paymentInfo?: string;
      };
      date: string;
      time: string;
      customer: {
        name: string;
        email: string;
        phone: string;
        notes?: string;
        agreeToTerms: boolean;
      };
    }) =>
      fetchAPI('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getSlots: (date: string) =>
      fetchAPI<string[]>(`/api/bookings/slots?date=${date}`),
    getMyBookings: () =>
      fetchAPI<{ bookings: any[] }>('/api/bookings/my', {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
  },
  orders: {
    getMyOrders: () =>
      fetchAPI<{ orders: any[] }>('/api/orders/my', {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
    getById: (id: string) =>
      fetchAPI<any>(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
      }),
  },
  checkout: {
    create: (data: {
      items: Array<{ productId: string; quantity: number }>;
      customerEmail: string;
      customerName?: string;
    }) =>
      fetchAPI<{ order: any; clientSecret: string }>('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  payments: {
    createDepositPayment: (data: {
      bookingId: string;
      customerEmail: string;
      customerName: string;
      serviceName: string;
      depositAmount: number;
    }) =>
      fetchAPI<{ clientSecret: string; paymentIntentId: string }>('/api/payments/deposit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createFullPayment: (data: {
      bookingId: string;
      customerEmail: string;
      customerName: string;
      serviceName: string;
      fullAmount: number;
    }) =>
      fetchAPI<{ clientSecret: string; paymentIntentId: string }>('/api/payments/full', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  chat: {
    send: (message: string, sessionId?: string) =>
      fetchAPI<{ response: string; sessionId: string }>(
        `${process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:4001'}/chat`,
        {
          method: 'POST',
          body: JSON.stringify({ message, sessionId }),
        }
      ),
  },
};
