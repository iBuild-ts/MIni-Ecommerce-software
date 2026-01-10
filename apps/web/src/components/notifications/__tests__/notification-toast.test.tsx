import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationProvider } from '@/hooks/use-notifications'
import { NotificationToast } from '@/components/notifications/notification-toast'

// Mock the notification context
const mockAddNotification = jest.fn()

jest.mock('@/hooks/use-notifications', () => ({
  ...jest.requireActual('@/hooks/use-notifications'),
  useNotificationContext: () => ({
    notifications: [
      {
        id: '1',
        type: 'success' as const,
        message: 'Test success message',
        timestamp: new Date(),
      },
      {
        id: '2',
        type: 'error' as const,
        message: 'Test error message',
        timestamp: new Date(),
      },
    ],
    addNotification: mockAddNotification,
    removeNotification: jest.fn(),
    clearNotifications: jest.fn(),
  }),
}))

describe('NotificationToast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification messages', () => {
    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    expect(screen.getByText('Test success message')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('displays correct icons for different notification types', () => {
    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    // Check for success icon (CheckCircle)
    const successIcon = screen.getByText('Test success message').closest('div')?.querySelector('svg')
    expect(successIcon).toBeInTheDocument()

    // Check for error icon (AlertCircle)
    const errorIcon = screen.getByText('Test error message').closest('div')?.querySelector('svg')
    expect(errorIcon).toBeInTheDocument()
  })

  it('applies correct styling for different notification types', () => {
    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    const successNotification = screen.getByText('Test success message').closest('div')
    const errorNotification = screen.getByText('Test error message').closest('div')

    // Success notification should have green styling
    expect(successNotification?.parentElement).toHaveClass('bg-green-50')

    // Error notification should have red styling
    expect(errorNotification?.parentElement).toHaveClass('bg-red-50')
  })

  it('does not render when there are no notifications', () => {
    // Mock empty notifications
    jest.doMock('@/hooks/use-notifications', () => ({
      useNotificationContext: () => ({
        notifications: [],
        addNotification: jest.fn(),
        removeNotification: jest.fn(),
        clearNotifications: jest.fn(),
      }),
    }))

    const { container } = render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    expect(container.firstChild).toBeNull()
  })

  it('calls removeNotification when close button is clicked', async () => {
    const mockRemoveNotification = jest.fn()
    
    jest.doMock('@/hooks/use-notifications', () => ({
      useNotificationContext: () => ({
        notifications: [
          {
            id: '1',
            type: 'success' as const,
            message: 'Test message',
            timestamp: new Date(),
          },
        ],
        addNotification: jest.fn(),
        removeNotification: mockRemoveNotification,
        clearNotifications: jest.fn(),
      }),
    }))

    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(mockRemoveNotification).toHaveBeenCalledWith('1')
    })
  })

  it('auto-removes notifications after 5 seconds', async () => {
    jest.useFakeTimers()
    
    const mockRemoveNotification = jest.fn()
    
    jest.doMock('@/hooks/use-notifications', () => ({
      useNotificationContext: () => ({
        notifications: [
          {
            id: '1',
            type: 'success' as const,
            message: 'Test message',
            timestamp: new Date(),
          },
        ],
        addNotification: jest.fn(),
        removeNotification: mockRemoveNotification,
        clearNotifications: jest.fn(),
      }),
    }))

    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    // Fast-forward 5 seconds
    jest.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(mockRemoveNotification).toHaveBeenCalledWith('1')
    })

    jest.useRealTimers()
  })

  it('renders notifications in correct order', () => {
    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    const notifications = screen.getAllByRole('alert')
    expect(notifications).toHaveLength(2)
    
    // First notification should be the success message
    expect(notifications[0]).toHaveTextContent('Test success message')
    
    // Second notification should be the error message
    expect(notifications[1]).toHaveTextContent('Test error message')
  })

  it('has proper accessibility attributes', () => {
    render(
      <NotificationProvider>
        <NotificationToast />
      </NotificationProvider>
    )

    const notifications = screen.getAllByRole('alert')
    notifications.forEach(notification => {
      expect(notification).toHaveAttribute('role', 'alert')
    })
  })
})
