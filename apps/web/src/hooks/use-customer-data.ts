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
    agreeToTerms: boolean;
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
  customer: {
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
      // In a real implementation, these would be authenticated API calls
      // For now, we'll create mock data based on the customer
      
      // Mock bookings data
      const mockBookings: Booking[] = [
        {
          id: 'booking_1',
          service: {
            id: 'sew-in-special',
            name: 'FALL IN LOVE WITH HAIR *SEW IN* SPECIAL',
            duration: '4 hours',
            price: '$249.99',
            category: 'specials',
            description: 'SALE VALID UNTIL Nov. 30TH WHILE SUPPLIES LAST\n16IN LOOSE WAVE (x3) bundles included',
            deposit: '$50',
            paymentInfo: '$50 DEPOSIT REQUIRED TO BOOK\nNON-REFUNDABLE\nRemaining balance of $199.99 due at appointment',
          },
          date: '2024-02-15',
          time: '10:00 AM',
          customer: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            notes: 'First time client, excited for the transformation!',
            agreeToTerms: true,
          },
          status: 'confirmed',
          depositPaid: true,
          createdAt: '2024-01-10T10:30:00Z',
        },
        {
          id: 'booking_2',
          service: {
            id: 'lash-lift-tint',
            name: 'Lash Lift & Tint',
            duration: '1.5 hours',
            price: '$120.00',
            category: 'lashes',
            description: 'Natural lash lift with tinting for enhanced look',
          },
          date: '2024-01-25',
          time: '2:00 PM',
          customer: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            notes: '',
            agreeToTerms: true,
          },
          status: 'completed',
          depositPaid: false,
          createdAt: '2024-01-05T14:20:00Z',
        },
      ];

      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: 'order_1',
          status: 'PAID',
          subtotalCents: 24999,
          totalCents: 24999,
          isPaid: true,
          createdAt: '2024-01-08T15:30:00Z',
          items: [
            {
              id: 'item_1',
              productName: '16IN LOOSE WAVE Bundle - Natural Black',
              quantity: 3,
              unitPriceCents: 8333,
              totalCents: 24999,
            },
          ],
          customer: {
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
          },
        },
        {
          id: 'order_2',
          status: 'SHIPPED',
          subtotalCents: 4500,
          totalCents: 4500,
          isPaid: true,
          createdAt: '2024-01-12T09:15:00Z',
          items: [
            {
              id: 'item_2',
              productName: 'Lash Aftercare Kit',
              quantity: 1,
              unitPriceCents: 4500,
              totalCents: 4500,
            },
          ],
          customer: {
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
          },
        },
      ];

      setBookings(mockBookings);
      setOrders(mockOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
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
