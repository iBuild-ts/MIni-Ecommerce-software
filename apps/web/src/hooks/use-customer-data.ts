import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Booking {
  id: string;
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
    notes: string;
    agreeToTerms?: boolean;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  depositPaid: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotalCents: number;
  totalCents: number;
  isPaid: boolean;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPriceCents: number;
    totalCents: number;
  }>;
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export function useCustomerData() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real bookings and orders from API
      const [bookingsRes, ordersRes] = await Promise.all([
        api.bookings.getMyBookings().catch(() => ({ bookings: [] })),
        api.orders.getMyOrders().catch(() => ({ orders: [] })),
      ]);

      setBookings(bookingsRes.bookings || []);
      setOrders(ordersRes.orders || []);
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
      // Set empty arrays on error
      setBookings([]);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchCustomerData();
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return {
    bookings,
    orders,
    isLoading,
    error,
    refreshData,
  };
}
