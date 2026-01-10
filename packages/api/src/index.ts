import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { performanceMonitor } from './middleware/performance-monitor';
import { generalRateLimit, authRateLimit } from './middleware/rate-limiter';
import { healthCheckService } from './services/health-check.service';

// Routes
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import customerRoutes from './modules/customers/customer.routes';
import leadRoutes from './modules/leads/lead.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import paymentRoutes from './modules/payments/payment.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { advancedAnalyticsRoutes } from './modules/analytics/advanced-analytics.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { handleStripeWebhook } from './modules/orders/order.webhooks';

const app: Express = express();

// Stripe webhook needs raw body
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [env.FRONTEND_URL, env.ADMIN_URL],
  credentials: true,
}));

// Performance monitoring middleware
app.use(performanceMonitor.middleware());

// Rate limiting middleware
app.use(generalRateLimit.middleware());

app.use(express.json());

// Health checks
app.get('/health', async (req, res) => {
  const result = await healthCheckService.simpleHealthCheck();
  res.json(result);
});

app.get('/health/detailed', async (req, res) => {
  try {
    const result = await healthCheckService.performHealthCheck();
    const statusCode = result.status === 'unhealthy' ? 503 : 
                      result.status === 'degraded' ? 200 : 200;
    res.status(statusCode).json(result);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    });
  });
});

app.get('/ready', async (req, res) => {
  const result = await healthCheckService.readinessCheck();
  const statusCode = result.ready ? 200 : 503;
  res.status(statusCode).json(result);
});

app.get('/live', async (req, res) => {
  const result = await healthCheckService.livenessCheck();
  res.json(result);
});

// API Routes with specific rate limiting
app.use('/api/auth', authRateLimit.middleware(), authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics/advanced', advancedAnalyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
