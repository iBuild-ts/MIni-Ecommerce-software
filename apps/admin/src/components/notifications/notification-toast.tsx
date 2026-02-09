'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationContextType {
  addNotification: (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const addNotification = (notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }) => {
    console.log('Notification:', notification);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function EmailTest({ email }: { email: string }) {
  return <div>Email Test Component - {email}</div>;
}
