import { stripe } from '../../config/stripe';
import { AppError } from '../../middleware/errorHandler';
import { simpleAuthService } from '../auth/auth.service.simple';

interface BookingPaymentData {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  depositAmount: number; // in cents
  serviceName: string;
}

export class BookingPaymentService {
  async createDepositPayment(data: BookingPaymentData) {
    // Create a payment intent for the booking deposit
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.depositAmount,
      currency: 'usd',
      metadata: {
        bookingId: data.bookingId,
        customerEmail: data.customerEmail,
        serviceName: data.serviceName,
        type: 'booking_deposit',
      },
      description: `Deposit for ${data.serviceName} - ${data.customerName}`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleDepositPaymentSuccess(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment not successful', 400);
    }

    const bookingId = paymentIntent.metadata.bookingId;
    const customerEmail = paymentIntent.metadata.customerEmail;

    // In a real implementation, you would update the booking in the database
    // For now, we'll just return the payment details
    return {
      bookingId,
      customerEmail,
      amount: paymentIntent.amount,
      status: 'paid',
    };
  }

  async createFullPayment(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    fullAmount: number;
    serviceName: string;
  }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.fullAmount,
      currency: 'usd',
      metadata: {
        bookingId: data.bookingId,
        customerEmail: data.customerEmail,
        serviceName: data.serviceName,
        type: 'booking_full_payment',
      },
      description: `Full payment for ${data.serviceName} - ${data.customerName}`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
}

export const bookingPaymentService = new BookingPaymentService();
