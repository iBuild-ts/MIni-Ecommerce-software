import { Request, Response, NextFunction } from 'express';
import { mockBookingPaymentService } from './booking-payment.service.mock';
import { emailService } from '../notifications/email.service';

export class BookingPaymentController {
  async createDepositPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, customerEmail, customerName, serviceName, depositAmount } = req.body;
      
      const result = await mockBookingPaymentService.createDepositPayment({
        bookingId,
        customerEmail,
        customerName,
        depositAmount,
        serviceName,
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createFullPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, customerEmail, customerName, serviceName, fullAmount } = req.body;
      
      const result = await mockBookingPaymentService.createFullPayment({
        bookingId,
        customerEmail,
        customerName,
        serviceName,
        fullAmount,
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handlePaymentSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentIntentId } = req.body;
      
      const result = await mockBookingPaymentService.handleDepositPaymentSuccess(paymentIntentId);
      
      // Send payment confirmation email
      if (result.success && result.customerEmail) {
        try {
          await emailService.sendPaymentConfirmation({
            customerName: result.customerName || 'Valued Customer',
            customerEmail: result.customerEmail,
            amount: result.amount || 0,
            bookingId: result.bookingId || 'Unknown',
            serviceName: result.serviceName || 'Beauty Service',
          });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
          // Don't fail the payment if email fails
        }
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const bookingPaymentController = new BookingPaymentController();
