import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

interface DashboardStats {
  totalBookings: number;
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  todayBookings: number;
  todayRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

interface RecentBooking {
  id: string;
  service: {
    name: string;
    price: string;
  };
  date: string;
  time: string;
  customer: {
    name: string;
    email: string;
  };
  status: string;
  depositPaid: boolean;
}

interface RecentOrder {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
  }>;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock dashboard data - in real app, these would be API calls
      const mockStats: DashboardStats = {
        totalBookings: 156,
        totalOrders: 89,
        totalRevenue: 45678,
        activeCustomers: 234,
        todayBookings: 8,
        todayRevenue: 1250,
        pendingBookings: 12,
        completedBookings: 134,
        monthlyRevenue: 12350,
        monthlyGrowth: 15.3,
      };

      const mockRecentBookings: RecentBooking[] = [
        {
          id: 'booking_1',
          service: {
            name: 'FALL IN LOVE WITH HAIR *SEW IN* SPECIAL',
            price: '$249.99',
          },
          date: '2024-02-15',
          time: '10:00 AM',
          customer: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
          },
          status: 'confirmed',
          depositPaid: true,
        },
        {
          id: 'booking_2',
          service: {
            name: 'Lash Lift & Tint',
            price: '$120.00',
          },
          date: '2024-02-14',
          time: '2:00 PM',
          customer: {
            name: 'Emily Davis',
            email: 'emily@example.com',
          },
          status: 'pending',
          depositPaid: false,
        },
        {
          id: 'booking_3',
          service: {
            name: 'Deep Conditioning Treatment',
            price: '$85.00',
          },
          date: '2024-02-13',
          time: '11:00 AM',
          customer: {
            name: 'Jessica Wilson',
            email: 'jessica@example.com',
          },
          status: 'completed',
          depositPaid: true,
        },
      ];

      const mockRecentOrders: RecentOrder[] = [
        {
          id: 'order_1',
          status: 'PAID',
          totalCents: 24999,
          createdAt: '2024-02-10T15:30:00Z',
          customer: {
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
          },
          items: [
            {
              productName: '16IN LOOSE WAVE Bundle - Natural Black',
              quantity: 3,
            },
          ],
        },
        {
          id: 'order_2',
          status: 'SHIPPED',
          totalCents: 4500,
          createdAt: '2024-02-09T09:15:00Z',
          customer: {
            email: 'emily@example.com',
            firstName: 'Emily',
            lastName: 'Davis',
          },
          items: [
            {
              productName: 'Lash Aftercare Kit',
              quantity: 1,
            },
          ],
        },
      ];

      setStats(mockStats);
      setRecentBookings(mockRecentBookings);
      setRecentOrders(mockRecentOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentBookings,
    recentOrders,
    isLoading,
    error,
    refreshData,
  };
}
