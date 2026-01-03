import { Request, Response } from 'express';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { orderService } from './order.service';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as any;
      try {
        await orderService.handlePaymentSuccess(paymentIntent.id);
        console.log('Payment processed successfully:', paymentIntent.id);
      } catch (error) {
        console.error('Error processing payment:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as any;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
