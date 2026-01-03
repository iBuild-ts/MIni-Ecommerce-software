import { Router } from 'express';
import { orderController } from './order.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Public checkout
router.post('/checkout', orderController.createCheckout.bind(orderController));

// Admin routes
router.get('/', authenticate, requireAdmin, orderController.getAll.bind(orderController));
router.get('/stats', authenticate, requireAdmin, orderController.getStats.bind(orderController));
router.get('/:id', authenticate, requireAdmin, orderController.getById.bind(orderController));
router.patch('/:id/status', authenticate, requireAdmin, orderController.updateStatus.bind(orderController));

export default router;
