import { Request, Response, NextFunction } from 'express';
import { mockBookingPaymentService } from './booking-payment.service.mock';

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
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const bookingPaymentController = new BookingPaymentController();
