import { Request, Response, NextFunction } from 'express';
import { StripePaymentService } from './stripe-payment.service';
import { emailService } from '../notifications/email.service';

export class BookingPaymentController {
  private stripePaymentService: StripePaymentService;

  constructor() {
    this.stripePaymentService = new StripePaymentService();
  }

  async createDepositPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, customerEmail, customerName, serviceName, depositAmount } = req.body;
      
      const result = await this.stripePaymentService.createPaymentIntent({
        amount: depositAmount,
        customerEmail,
        description: `Deposit payment for ${serviceName} - Booking: ${bookingId}`,
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createFullPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, customerEmail, customerName, serviceName, fullAmount } = req.body;
      
      const result = await this.stripePaymentService.createPaymentIntent({
        amount: fullAmount,
        customerEmail,
        description: `Full payment for ${serviceName} - Booking: ${bookingId}`,
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handlePaymentSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentIntentId, customerEmail, customerName, depositAmount, bookingId, serviceName } = req.body;
      
      const result = await this.stripePaymentService.confirmPayment(paymentIntentId);
      
      // Send payment confirmation email
      if (result.success && customerEmail) {
        try {
          await emailService.sendPaymentConfirmation({
            customerName: customerName || 'Valued Customer',
            customerEmail,
            amount: depositAmount || 0,
            bookingId,
            serviceName: serviceName || 'Beauty Service',
          });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
          // Don't fail the payment if email fails
        }
      }
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!sig || !webhookSecret) {
        return res.status(400).json({ error: 'Webhook signature missing' });
      }

      const event = require('stripe')(req.body, sig);
      const result = await this.stripePaymentService.handleWebhook(event);
      
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
}

export const bookingPaymentController = new BookingPaymentController();
