import { Router } from 'express';
import { bookingPaymentController } from './booking-payment.controller';

const router = Router();

// Create booking deposit payment
router.post('/deposit', bookingPaymentController.createDepositPayment.bind(bookingPaymentController));

// Create booking full payment
router.post('/full', bookingPaymentController.createFullPayment.bind(bookingPaymentController));

// Handle payment success (webhook)
router.post('/success', bookingPaymentController.handlePaymentSuccess.bind(bookingPaymentController));

export default router;
