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
      // Fetch real dashboard data from API
      const [statsResponse, bookingsResponse, ordersResponse] = await Promise.all([
        adminApi.get('/dashboard/stats'),
        adminApi.get('/dashboard/recent-bookings'),
        adminApi.get('/dashboard/recent-orders')
      ]);

      const stats: DashboardStats = statsResponse.data;
      const recentBookings: RecentBooking[] = bookingsResponse.data;
      const recentOrders: RecentOrder[] = ordersResponse.data;

      setStats(stats);
      setRecentBookings(recentBookings);
      setRecentOrders(recentOrders);
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
