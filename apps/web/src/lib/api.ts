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
  products: {
    getAll: (params?: { category?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
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
      email: string;
      name?: string;
      phone?: string;
      scheduledFor: string;
      service?: string;
      source: string;
    }) =>
      fetchAPI('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getSlots: (date: string) =>
      fetchAPI<Date[]>(`/api/bookings/slots?date=${date}`),
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
