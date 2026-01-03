import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', analyticsController.getDashboardStats.bind(analyticsController));
router.get('/sales-chart', analyticsController.getSalesChart.bind(analyticsController));
router.get('/top-products', analyticsController.getTopProducts.bind(analyticsController));
router.get('/recent-orders', analyticsController.getRecentOrders.bind(analyticsController));
router.get('/conversion', analyticsController.getConversionRate.bind(analyticsController));

export default router;
