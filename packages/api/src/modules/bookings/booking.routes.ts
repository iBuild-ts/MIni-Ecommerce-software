import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Public routes
router.post('/', bookingController.create.bind(bookingController));
router.get('/slots', bookingController.getAvailableSlots.bind(bookingController));

// Admin routes
router.get('/', authenticate, requireAdmin, bookingController.getAll.bind(bookingController));
router.get('/calendar', authenticate, requireAdmin, bookingController.getCalendar.bind(bookingController));
router.get('/:id', authenticate, requireAdmin, bookingController.getById.bind(bookingController));
router.patch('/:id', authenticate, requireAdmin, bookingController.update.bind(bookingController));
router.patch('/:id/status', authenticate, requireAdmin, bookingController.updateStatus.bind(bookingController));

export default router;
