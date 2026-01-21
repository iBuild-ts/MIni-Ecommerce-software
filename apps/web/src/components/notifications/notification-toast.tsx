'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotificationContext } from '@/hooks/use-notifications';

export function NotificationToast() {
  const { notifications, removeNotification } = useNotificationContext();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const icon = notification.type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : notification.type === 'error' ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : (
          <Info className="h-5 w-5 text-blue-500" />
        );

        const bgColor = notification.type === 'success' ? 'bg-green-50 border-green-200' :
                       notification.type === 'error' ? 'bg-red-50 border-red-200' :
                       'bg-blue-50 border-blue-200';

        const textColor = notification.type === 'success' ? 'text-green-800' :
                         notification.type === 'error' ? 'text-red-800' :
                         'text-blue-800';

        return (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${bgColor} min-w-[300px] max-w-md animate-in slide-in-from-right`}
          >
            {icon}
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor}`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={`p-1 rounded-full hover:bg-black/10 transition-colors ${textColor}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface NotificationButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function NotificationButton({ 
  onClick, 
  isLoading = false, 
  children, 
  variant = 'primary' 
}: NotificationButtonProps) {
  const { addNotification } = useNotificationContext();

  const handleClick = async () => {
    try {
      await onClick();
      addNotification({
        type: 'success',
        message: 'Notification sent successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send notification',
      });
    }
  };

  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === 'primary' 
    ? "bg-brand-500 text-white hover:bg-brand-600" 
    : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isLoading ? 'Sending...' : children}
    </button>
  );
}

