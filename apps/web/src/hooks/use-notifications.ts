import { useState, useCallback } from 'react';

interface NotificationStatus {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface UseNotificationsReturn {
  sendBookingConfirmation: (data: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
    price: string;
    deposit?: string;
  }) => Promise<NotificationStatus>;
  sendBookingReminder: (data: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
  }) => Promise<NotificationStatus>;
  sendPaymentConfirmation: (data: {
    customerName: string;
    customerEmail: string;
    amount: number;
    bookingId: string;
    serviceName: string;
  }) => Promise<NotificationStatus>;
  sendOrderConfirmation: (data: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }) => Promise<NotificationStatus>;
  sendWelcomeEmail: (data: {
    name: string;
    email: string;
  }) => Promise<NotificationStatus>;
  testEmail: (email: string) => Promise<NotificationStatus>;
  isLoading: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(async (endpoint: string, data: any): Promise<NotificationStatus> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.messageId,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to send notification',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendBookingConfirmation = useCallback(async (data: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
    price: string;
    deposit?: string;
  }) => {
    return sendRequest('booking-confirmation', data);
  }, [sendRequest]);

  const sendBookingReminder = useCallback(async (data: {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    date: string;
    time: string;
  }) => {
    return sendRequest('booking-reminder', data);
  }, [sendRequest]);

  const sendPaymentConfirmation = useCallback(async (data: {
    customerName: string;
    customerEmail: string;
    amount: number;
    bookingId: string;
    serviceName: string;
  }) => {
    return sendRequest('payment-confirmation', data);
  }, [sendRequest]);

  const sendOrderConfirmation = useCallback(async (data: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }) => {
    return sendRequest('order-confirmation', data);
  }, [sendRequest]);

  const sendWelcomeEmail = useCallback(async (data: {
    name: string;
    email: string;
  }) => {
    return sendRequest('welcome', data);
  }, [sendRequest]);

  const testEmail = useCallback(async (email: string) => {
    return sendRequest('test', { to: email });
  }, [sendRequest]);

  return {
    sendBookingConfirmation,
    sendBookingReminder,
    sendPaymentConfirmation,
    sendOrderConfirmation,
    sendWelcomeEmail,
    testEmail,
    isLoading,
  };
}

// Notification context for global state management
import { createContext, useContext, ReactNode } from 'react';

interface NotificationContextType {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>;
  addNotification: (notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  }) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  const addNotification = useCallback((notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  }) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, {
      id,
      ...notification,
      timestamp: new Date(),
    }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
