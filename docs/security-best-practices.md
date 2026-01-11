# MYGlamBeauty - Security Best Practices

## 🔐 Security Implementation Guide

### Authentication & Authorization

#### JWT Security
```typescript
// Secure JWT implementation
export class AuthService {
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
      issuer: 'myglambeauty',
      audience: 'myglambeauty-users',
      algorithm: 'HS256',
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  refreshToken(refreshToken: string): string {
    const payload = this.verifyToken(refreshToken);
    return this.generateToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }
}
```

#### Role-Based Access Control (RBAC)
```typescript
// RBAC implementation
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export const permissions = {
  [UserRole.CUSTOMER]: ['read:own_profile', 'create:booking', 'read:products'],
  [UserRole.STAFF]: ['read:bookings', 'update:booking_status', 'read:customers'],
  [UserRole.ADMIN]: ['*'],
  [UserRole.SUPER_ADMIN]: ['*'],
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const userPermissions = permissions[user.role] || [];
    
    if (!userPermissions.includes('*') && !userPermissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### Data Protection

#### Input Sanitization
```typescript
// Input sanitization and validation
import DOMPurify from 'dompurify';
import { z } from 'zod';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: [],
  });
};

export const BookingSchema = z.object({
  name: z.string().min(2).max(100).transform(sanitizeInput),
  email: z.string().email(),
  notes: z.string().max(500).optional().transform(sanitizeInput),
  phone: z.string().regex(/^\+?[\d\s-()]+$/),
});

export const validateAndSanitize = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Invalid input',
        details: error.errors,
      });
    }
  };
};
```

#### SQL Injection Prevention
```typescript
// Secure database queries
export class BookingRepository {
  async findBookingsByCustomer(customerId: string): Promise<Booking[]> {
    // Using parameterized queries to prevent SQL injection
    return await prisma.booking.findMany({
      where: {
        customerId: customerId, // Prisma automatically parameterizes
      },
      select: {
        id: true,
        scheduledFor: true,
        service: true,
        status: true,
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async createBooking(data: CreateBookingData): Promise<Booking> {
    // Validate data before insertion
    const validatedData = BookingSchema.parse(data);
    
    return await prisma.booking.create({
      data: {
        ...validatedData,
        status: BookingStatus.PENDING,
      },
    });
  }
}
```

#### XSS Protection
```typescript
// XSS protection middleware
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Additional XSS protection
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

### API Security

#### Rate Limiting
```typescript
// Advanced rate limiting
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs,
    max,
    message: message || 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip || 'unknown';
    },
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// Different limits for different endpoints
app.use('/api/auth/login', createRateLimit(15 * 60 * 1000, 5, 'Too many login attempts'));
app.use('/api/auth/register', createRateLimit(60 * 60 * 1000, 3, 'Too many registration attempts'));
app.use('/api/booking', createRateLimit(15 * 60 * 1000, 10));
app.use('/api/', createRateLimit(15 * 60 * 1000, 100));
```

#### API Key Security
```typescript
// API key management
export class APIKeyService {
  generateAPIKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  async createAPIKey(userId: string, permissions: string[]): Promise<APIKey> {
    const key = this.generateAPIKey();
    const hashedKey = this.hashAPIKey(key);
    
    return await prisma.apiKey.create({
      data: {
        userId,
        hashedKey,
        permissions,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  async validateAPIKey(apiKey: string): Promise<APIKey | null> {
    const hashedKey = this.hashAPIKey(apiKey);
    return await prisma.apiKey.findFirst({
      where: {
        hashedKey,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }
}
```

### Database Security

#### Encryption at Rest
```typescript
// Data encryption
import crypto from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

#### Database Security Configuration
```sql
-- Database security hardening
-- Create dedicated user with limited permissions
CREATE USER myglambeauty_app WITH PASSWORD 'secure_password';

-- Grant specific permissions only
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myglambeauty_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myglambeauty_app;

-- Revoke dangerous permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO myglambeauty_app;

-- Enable row level security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY customer_own_data ON customers
    FOR ALL TO myglambeauty_app
    USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY staff_booking_access ON bookings
    FOR ALL TO myglambeauty_app
    USING (
        customer_id = current_setting('app.current_user_id')::uuid OR
        current_setting('app.user_role') = 'STAFF' OR
        current_setting('app.user_role') = 'ADMIN'
    );
```

### Payment Security

#### Stripe Security Best Practices
```typescript
// Secure payment processing
export class PaymentService {
  async createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent> {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    return await stripe.paymentIntents.confirm(paymentIntentId);
  }

  async handleWebhook(req: Request): Promise<void> {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update order status, send confirmation, etc.
    await this.orderService.updateOrderStatus(paymentIntent.metadata.orderId, 'PAID');
    await this.emailService.sendPaymentConfirmation(paymentIntent.metadata.customerEmail);
  }
}
```

### Infrastructure Security

#### Docker Security
```dockerfile
# Secure Dockerfile
FROM node:18-alpine AS base

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

#### Kubernetes Security
```yaml
# Security context for pods
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myglambeauty-api
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
      containers:
      - name: api
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
          runAsNonRoot: true
          runAsUser: 1001
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Monitoring & Logging

#### Security Monitoring
```typescript
// Security event logging
export class SecurityLogger {
  static logSecurityEvent(event: {
    type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'PERMISSION_DENIED' | 'SUSPICIOUS_ACTIVITY';
    userId?: string;
    ip: string;
    userAgent?: string;
    details?: any;
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };

    // Log to secure logging system
    logger.warn('Security Event', logEntry);

    // Send alerts for critical events
    if (event.type === 'SUSPICIOUS_ACTIVITY') {
      this.sendSecurityAlert(logEntry);
    }
  }

  private static async sendSecurityAlert(event: any) {
    // Send to security team
    await fetch(process.env.SECURITY_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  }
}
```

### Compliance & Auditing

#### GDPR Compliance
```typescript
// GDPR compliance features
export class GDPRService {
  async exportUserData(userId: string): Promise<UserDataExport> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: true,
        orders: true,
        customerProfile: true,
      },
    });

    return {
      personalData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      bookings: user.bookings,
      orders: user.orders,
      profile: user.customerProfile,
    };
  }

  async deleteUserData(userId: string): Promise<void> {
    // Soft delete with anonymization
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${Date.now()}@deleted.com`,
        name: 'Deleted User',
        phone: null,
        isActive: false,
        deletedAt: new Date(),
      },
    });

    // Anonymize related data
    await prisma.booking.updateMany({
      where: { customerId: userId },
      data: {
        customerName: 'Deleted User',
        customerEmail: `deleted-${Date.now()}@deleted.com`,
        customerPhone: null,
      },
    });
  }
}
```

## 🔒 Security Checklist

### Authentication
- [ ] JWT tokens with proper expiration
- [ ] Secure password hashing (bcrypt)
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Secure session management

### Data Protection
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Data encryption at rest

### API Security
- [ ] HTTPS enforcement
- [ ] API key management
- [ ] Request rate limiting
- [ ] IP whitelisting for admin
- [ ] Request/response logging

### Infrastructure
- [ ] Container security best practices
- [ ] Network segmentation
- [ ] Firewall configuration
- [ ] Security monitoring
- [ ] Regular security updates

### Compliance
- [ ] GDPR compliance
- [ ] Data retention policies
- [ ] Privacy policy implementation
- [ ] Cookie consent
- [ ] Audit logging

This security implementation ensures your MYGlamBeauty application meets enterprise-grade security standards!
