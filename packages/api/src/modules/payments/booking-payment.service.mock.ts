import { AppError } from '../../middleware/errorHandler';

interface BookingPaymentData {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  depositAmount: number; // in cents
  serviceName: string;
}

export class MockBookingPaymentService {
  async createDepositPayment(data: BookingPaymentData) {
    // Mock implementation - simulate Stripe payment intent creation
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: data.depositAmount,
      status: 'requires_payment_method',
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id,
    };
  }

  async handleDepositPaymentSuccess(paymentIntentId: string) {
    // Mock implementation - simulate payment success handling
    console.log('Mock payment success for:', paymentIntentId);
    
    return {
      bookingId: paymentIntentId.replace('pi_mock_', ''),
      customerEmail: 'test@example.com',
      amount: 1000,
      status: 'paid',
    };
  }

  async createFullPayment(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    serviceName: string;
    fullAmount: number;
  }) {
    // Mock implementation for full payment
    const mockPaymentIntent = {
      id: `pi_full_mock_${Date.now()}`,
      client_secret: `pi_full_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: data.fullAmount,
      status: 'requires_payment_method',
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id,
    };
  }
}

export const mockBookingPaymentService = new MockBookingPaymentService();
