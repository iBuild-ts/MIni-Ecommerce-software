import { Router } from 'express';
import { NotificationController } from './notification.controller';

const router = Router();
const notificationController = new NotificationController();

// Booking notifications
router.post('/booking-confirmation', notificationController.sendBookingConfirmation);
router.post('/booking-reminder', notificationController.sendBookingReminder);

// Payment notifications
router.post('/payment-confirmation', notificationController.sendPaymentConfirmation);

// Order notifications
router.post('/order-confirmation', notificationController.sendOrderConfirmation);

// User notifications
router.post('/welcome', notificationController.sendWelcomeEmail);

// Test endpoint
router.post('/test', notificationController.testEmail);

export { router as notificationRoutes };
