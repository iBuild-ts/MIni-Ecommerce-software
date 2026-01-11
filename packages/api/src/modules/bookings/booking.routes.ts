import { Router } from 'express';
import { SimpleBookingController } from './booking.controller.simple';
import { authenticate } from '../../middleware/auth';

const router: Router = Router();
const simpleBookingController = new SimpleBookingController();

// Public routes
router.post('/', simpleBookingController.create.bind(simpleBookingController));
router.get('/slots', simpleBookingController.getAvailableSlots.bind(simpleBookingController));

// Customer route - get my bookings
router.get('/my', authenticate, simpleBookingController.getMyBookings.bind(simpleBookingController));

// Admin routes (made public for testing)
router.get('/', simpleBookingController.getAll.bind(simpleBookingController));
router.get('/calendar', simpleBookingController.getCalendar.bind(simpleBookingController));
router.get('/:id', simpleBookingController.getById.bind(simpleBookingController));
router.patch('/:id', simpleBookingController.update.bind(simpleBookingController));
router.patch('/:id/status', simpleBookingController.updateStatus.bind(simpleBookingController));
router.delete('/:id', simpleBookingController.delete.bind(simpleBookingController));

export default router;
