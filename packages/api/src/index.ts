import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import customerRoutes from './modules/customers/customer.routes';
import leadRoutes from './modules/leads/lead.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import paymentRoutes from './modules/payments/payment.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { handleStripeWebhook } from './modules/orders/order.webhooks';

const app = express();

// Stripe webhook needs raw body
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [env.FRONTEND_URL, env.ADMIN_URL],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

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
