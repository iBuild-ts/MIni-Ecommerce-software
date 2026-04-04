import Stripe from 'stripe';
import { env } from '../../config/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  customerEmail?: string;
  description?: string;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export class StripePaymentService {
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency || 'usd',
        description: params.description,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          customerEmail: params.customerEmail || '',
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: paymentIntent.status === 'succeeded',
        message: paymentIntent.status === 'succeeded' 
          ? 'Payment successful' 
          : `Payment status: ${paymentIntent.status}`,
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      return {
        success: false,
        message: `Failed to confirm payment: ${error.message}`,
      };
    }
  }

  async createRefund(paymentIntentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        success: false,
      };
    }
  }

  async handleWebhook(event: any): Promise<{ processed: boolean; error?: string }> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.object);
          return { processed: true };
          
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object);
          return { processed: true };
          
        default:
          console.log('Unhandled webhook event:', event.type);
          return { processed: true };
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { processed: false, error: error.message };
    }
  }
}
