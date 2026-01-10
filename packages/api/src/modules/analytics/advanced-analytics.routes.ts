import { Router } from 'express';
import { AdvancedAnalyticsController } from './advanced-analytics.controller';

const router = Router();
const advancedAnalyticsController = new AdvancedAnalyticsController();

// Comprehensive metrics
router.get('/metrics', advancedAnalyticsController.getComprehensiveMetrics);

// Real-time metrics
router.get('/realtime', advancedAnalyticsController.getRealTimeMetrics);

// Generate reports
router.get('/reports', advancedAnalyticsController.generateReport);

// Performance insights
router.get('/insights', advancedAnalyticsController.getPerformanceInsights);

export { router as advancedAnalyticsRoutes };
