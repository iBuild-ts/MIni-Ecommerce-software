import { Router } from 'express';
import { customerController } from './customer.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', customerController.getAll.bind(customerController));
router.get('/stats', customerController.getStats.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));
router.patch('/:id', customerController.update.bind(customerController));
router.post('/:id/tags', customerController.addTag.bind(customerController));
router.delete('/:id/tags/:tag', customerController.removeTag.bind(customerController));

export default router;
