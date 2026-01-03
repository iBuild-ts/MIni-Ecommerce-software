import { Router } from 'express';
import { leadController } from './lead.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Public route for lead capture
router.post('/', leadController.create.bind(leadController));

// Admin routes
router.get('/', authenticate, requireAdmin, leadController.getAll.bind(leadController));
router.get('/stats', authenticate, requireAdmin, leadController.getStats.bind(leadController));
router.get('/:id', authenticate, requireAdmin, leadController.getById.bind(leadController));
router.patch('/:id', authenticate, requireAdmin, leadController.update.bind(leadController));
router.delete('/:id', authenticate, requireAdmin, leadController.delete.bind(leadController));

export default router;
