'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Users,
  Calendar,
  ShoppingBag,
  CreditCard,
  TestTube,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { useNotificationContext, EmailTest } from '@/components/notifications/notification-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  testData: Record<string, any>;
}

export default function NotificationsPage() {
  const { isLoading } = useNotifications();
  const { addNotification } = useNotificationContext();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('test@myglambeauty.com');

  const templates: NotificationTemplate[] = [
    {
      id: 'booking-confirmation',
      name: 'Booking Confirmation',
      description: 'Sent when a customer books an appointment',
      icon: <Calendar className="h-5 w-5" />,
      endpoint: 'booking-confirmation',
      testData: {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        serviceName: 'Sew-in Special',
        date: 'January 15, 2024',
        time: '10:00 AM',
        price: '$150.00',
        deposit: '$50.00',
      },
    },
    {
      id: 'booking-reminder',
      name: 'Booking Reminder',
      description: 'Sent 24 hours before appointment',
      icon: <Calendar className="h-5 w-5" />,
      endpoint: 'booking-reminder',
      testData: {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        serviceName: 'Sew-in Special',
        date: 'January 15, 2024',
        time: '10:00 AM',
      },
    },
    {
      id: 'payment-confirmation',
      name: 'Payment Confirmation',
      description: 'Sent when payment is processed',
      icon: <CreditCard className="h-5 w-5" />,
      endpoint: 'payment-confirmation',
      testData: {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        amount: 5000,
        bookingId: 'BK-001',
        serviceName: 'Sew-in Special',
      },
    },
    {
      id: 'order-confirmation',
      name: 'Order Confirmation',
      description: 'Sent when a customer places a product order',
      icon: <ShoppingBag className="h-5 w-5" />,
      endpoint: 'order-confirmation',
      testData: {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        orderId: 'ORD-001',
        total: 14999,
        items: [
          { name: '16IN LOOSE WAVE Bundle', quantity: 1, price: 13499 },
          { name: 'Lash Aftercare Kit', quantity: 1, price: 1500 },
        ],
      },
    },
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Sent when a new customer registers',
      icon: <Users className="h-5 w-5" />,
      endpoint: 'welcome',
      testData: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
      },
    },
  ];

  const handleSendTest = async (template: NotificationTemplate) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${template.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template.testData,
          customerEmail: testEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Email Sent',
          message: `${template.name} sent successfully to ${testEmail}`,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Email Failed',
          message: `Failed to send ${template.name}: ${result.error}`,
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Network Error',
        message: `Network error sending ${template.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Notifications</h1>
              <p className="text-sm text-gray-600">Manage and test email templates</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email Service Status</h3>
                <p className="text-sm text-gray-600">SMTP configuration and delivery status</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Provider</p>
              <p className="font-medium text-gray-900">Mock Service</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Last Test</p>
              <p className="font-medium text-gray-900">Never</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Delivered Today</p>
              <p className="font-medium text-gray-900">0</p>
            </div>
          </div>
        </motion.div>

        {/* Test Email Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <EmailTest email={testEmail} />
        </motion.div>

        {/* Email Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Test Data:</p>
                    <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                      {JSON.stringify(template.testData, null, 2).substring(0, 100)}...
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSendTest(template)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Test'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Configuration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Email Configuration</h3>
              <p className="text-sm text-blue-800 mb-3">
                The email service is currently running in mock mode for development. To enable real email delivery:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Configure SMTP settings in your environment variables</li>
                <li>Set up SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_PORT</li>
                <li>Configure SMTP_FROM for sender information</li>
                <li>Test with a real email address to verify delivery</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
