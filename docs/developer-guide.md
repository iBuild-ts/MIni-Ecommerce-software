# MYGlamBeauty Developer Guide

## Overview

This guide provides comprehensive information for developers working on the MYGlamBeauty beauty salon management system. It covers setup, architecture, coding standards, testing, and contribution guidelines.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Architecture](#project-architecture)
3. [Coding Standards](#coding-standards)
4. [Testing](#testing)
5. [Debugging](#debugging)
6. [Performance](#performance)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Development Setup

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+
- **Docker** and **Docker Compose**
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/myglambeauty-supply.git
cd myglambeauty-supply
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
# Database, Redis, Stripe, SMTP, etc.
```

4. **Start development environment:**
```bash
# Using Docker Compose (recommended)
pnpm docker:up

# Or start services individually
pnpm dev
```

5. **Set up database:**
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### IDE Configuration

#### VS Code Extensions

Recommended extensions for optimal development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode-remote.remote-containers"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Project Architecture

### Monorepo Structure

```
myglambeauty-supply/
├── apps/                    # Frontend applications
│   ├── web/                # Customer web app (Next.js)
│   └── admin/              # Admin dashboard (Next.js)
├── packages/               # Shared packages
│   ├── api/                # Backend API (Express.js)
│   ├── db/                 # Database schema & client (Prisma)
│   └── ui/                 # Shared UI components
├── docs/                   # Documentation
├── scripts/                # Build & deployment scripts
├── k8s/                    # Kubernetes manifests
├── monitoring/             # Monitoring configuration
└── nginx/                  # Nginx configuration
```

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Query** - Server state management

**Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Nodemailer** - Email sending
- **Stripe** - Payment processing

**Infrastructure:**
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD
- **Prometheus** - Monitoring
- **Grafana** - Visualization

### Data Flow

```
Frontend (Next.js) → API Gateway (Nginx) → Backend API (Express) → Database (PostgreSQL)
                                    ↓
                              Cache (Redis)
                                    ↓
                            External Services (Stripe, SMTP)
```

## Coding Standards

### TypeScript

**Use strict TypeScript configuration:**
```typescript
// Enable strict mode
"strict": true
"noImplicitAny": true
"strictNullChecks": true
```

**Type definitions:**
```typescript
// Good: Explicit types
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Bad: Implicit any
function getUser(id) {
  // implementation
}
```

**Prefer interfaces over types for objects:**
```typescript
// Good
interface Product {
  id: string;
  name: string;
  price: number;
}

// Acceptable for unions
type Status = 'pending' | 'confirmed' | 'cancelled';
```

### React/Next.js

**Component structure:**
```typescript
// Good: Functional component with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**Use hooks correctly:**
```typescript
// Good: Hooks at top level
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading, error } = useUser(userId);
  
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);
  
  // Component JSX
};
```

**File naming:**
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`
- Constants: `UPPER_SNAKE_CASE.ts`

### Backend (Express.js)

**Controller structure:**
```typescript
// Good: Structured controller with error handling
export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingData = CreateBookingSchema.parse(req.body);
      const booking = await bookingService.create(bookingData);
      
      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

**Service layer:**
```typescript
// Good: Service with business logic
export class BookingService {
  async create(data: CreateBookingData): Promise<Booking> {
    // Validate business rules
    if (await this.isTimeSlotTaken(data.scheduledFor)) {
      throw new AppError('Time slot is already taken', 409);
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        ...data,
        status: BookingStatus.PENDING,
      },
    });
    
    // Send notifications
    await notificationService.sendBookingConfirmation(booking);
    
    return booking;
  }
}
```

### Database (Prisma)

**Schema design:**
```prisma
model Booking {
  id            String    @id @default(cuid())
  email         String
  name          String
  phone         String?
  scheduledFor  DateTime
  service       String
  status        BookingStatus @default(PENDING)
  notes         String?
  customerId    String?   @relation(fields: [customerId], references: [id])
  customer      Customer? @relation(fields: [customerId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("bookings")
}
```

**Database queries:**
```typescript
// Good: Efficient queries with proper error handling
export class BookingRepository {
  async findById(id: string): Promise<Booking | null> {
    try {
      return await prisma.booking.findUnique({
        where: { id },
        include: {
          customer: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find booking', error);
    }
  }
}
```

### CSS (Tailwind)

**Component styling:**
```typescript
// Good: Consistent utility classes
const Button = ({ variant = 'primary', children, ...props }) => (
  <button
    className={`
      px-4 py-2 rounded-lg font-medium transition-colors
      ${variant === 'primary' 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      }
    `}
    {...props}
  >
    {children}
  </button>
);
```

**Responsive design:**
```typescript
// Good: Mobile-first responsive design
const ProductCard = ({ product }) => (
  <div className="w-full max-w-sm mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Content */}
      </div>
    </div>
  </div>
);
```

## Testing

### Testing Strategy

1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - API endpoints and database operations
3. **E2E Tests** - Full user workflows
4. **Performance Tests** - Load and stress testing

### Unit Testing (Jest + React Testing Library)

**Component tests:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Service tests:**
```typescript
import { BookingService } from '../booking.service';
import { TestDatabase } from '../../utils/test-database';

describe('BookingService', () => {
  let bookingService: BookingService;

  beforeEach(async () => {
    await TestDatabase.setup();
    bookingService = new BookingService();
  });

  afterEach(async () => {
    await TestDatabase.cleanup();
  });

  it('creates a booking successfully', async () => {
    const bookingData = {
      email: 'test@example.com',
      name: 'Test User',
      scheduledFor: new Date(),
      service: 'Hair Styling',
    };

    const booking = await bookingService.create(bookingData);

    expect(booking).toBeDefined();
    expect(booking.email).toBe(bookingData.email);
    expect(booking.status).toBe('PENDING');
  });
});
```

### Integration Testing

**API tests:**
```typescript
import request from 'supertest';
import { app } from '../app';

describe('POST /api/bookings', () => {
  it('creates a booking with valid data', async () => {
    const bookingData = {
      email: 'test@example.com',
      name: 'Test User',
      scheduledFor: '2024-01-15T10:00:00Z',
      service: 'Hair Styling',
    };

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingData)
      .expect(201);

    expect(response.body.data.email).toBe(bookingData.email);
    expect(response.body.data.status).toBe('PENDING');
  });
});
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test booking.service.test.ts

# Run integration tests
pnpm test:integration
```

## Debugging

### Backend Debugging

**Using VS Code debugger:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/packages/api/src/index.ts",
      "outFiles": ["${workspaceFolder}/packages/api/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

**Logging:**
```typescript
// Use structured logging
import logger from '../utils/logger';

export class BookingService {
  async create(data: CreateBookingData): Promise<Booking> {
    logger.info('Creating booking', { 
      email: data.email, 
      service: data.service 
    });
    
    try {
      const booking = await prisma.booking.create({ data });
      logger.info('Booking created successfully', { 
        bookingId: booking.id 
      });
      return booking;
    } catch (error) {
      logger.error('Failed to create booking', { 
        error: error.message,
        email: data.email 
      });
      throw error;
    }
  }
}
```

### Frontend Debugging

**React DevTools:**
- Install React Developer Tools browser extension
- Use component profiler for performance analysis
- Inspect component state and props

**Network debugging:**
```typescript
// Use React Query for API debugging
import { useQuery } from '@tanstack/react-query';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch('/api/bookings');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Performance

### Frontend Optimization

**Code splitting:**
```typescript
// Dynamic imports for heavy components
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// Route-based code splitting
const AdminPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AdminDashboard />
  </Suspense>
);
```

**Image optimization:**
```typescript
import Image from 'next/image';

// Optimized images
const ProductImage = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={300}
    height={300}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    className="rounded-lg"
  />
);
```

### Backend Optimization

**Database queries:**
```typescript
// Efficient queries with proper indexing
export class BookingRepository {
  async findBookingsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.booking.findMany({
      where: {
        scheduledFor: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });
  }
}
```

**Caching strategy:**
```typescript
// Redis caching for frequently accessed data
export class ProductService {
  async getPopularProducts() {
    const cacheKey = 'products:popular';
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch from database
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 10,
    });
    
    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(products));
    
    return products;
  }
}
```

## Security

### Authentication & Authorization

**JWT implementation:**
```typescript
export class AuthService {
  generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { 
        expiresIn: '7d',
        issuer: 'myglambeauty',
        audience: 'myglambeauty-users'
      }
    );
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}
```

**Input validation:**
```typescript
// Zod schemas for validation
import { z } from 'zod';

export const CreateBookingSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  scheduledFor: z.string().datetime('Invalid date format'),
  service: z.string().min(1, 'Service is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});
```

### Data Protection

**Environment variables:**
```typescript
// Secure environment variable handling
export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## Deployment

### Build Process

**Frontend build:**
```bash
# Build for production
pnpm build

# Analyze bundle size
pnpm analyze
```

**Backend build:**
```bash
# Compile TypeScript
pnpm build

# Generate Prisma client
pnpm db:generate
```

### Docker Configuration

**Multi-stage builds:**
```dockerfile
# packages/api/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 4000
CMD ["node", "dist/index.js"]
```

## Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check database connectivity
pnpm db:studio

# Reset database
pnpm db:reset

# Check migrations
pnpm db:migrate:status
```

**TypeScript compilation errors:**
```bash
# Check TypeScript configuration
pnpm type-check

# Clear TypeScript cache
rm -rf .next/
rm -rf dist/
pnpm build
```

**Dependency issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules/
rm pnpm-lock.yaml
pnpm install
```

### Performance Issues

**Slow API responses:**
1. Check database query performance
2. Add appropriate indexes
3. Implement caching
4. Use query optimization

**Memory leaks:**
1. Profile with Node.js inspector
2. Check for event listener leaks
3. Monitor heap usage
4. Optimize garbage collection

### Debug Commands

```bash
# Check application health
curl http://localhost:4000/health

# View logs
docker-compose logs -f api

# Monitor resource usage
docker stats

# Database performance
pnpm db:studio
```

## Contributing

### Pull Request Process

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test:**
```bash
pnpm test
pnpm lint
pnpm type-check
```

3. **Commit changes:**
```bash
git commit -m "feat: add new booking feature"
```

4. **Push and create PR:**
```bash
git push origin feature/your-feature-name
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes without discussion
- [ ] Security considerations addressed
- [ ] Performance impact considered

### Release Process

1. Update version numbers
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. Run smoke tests
6. Deploy to production
7. Monitor for issues

## Resources

### Documentation

- [API Reference](./api/README.md)
- [Database Schema](./database.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Security Guide](./security.md)

### Tools

- [Prisma Studio](https://www.prisma.io/studio) - Database management
- [Postman Collection](./api/postman-collection.json) - API testing
- [Figma Design](https://figma.com/myglambeauty) - UI designs

### Community

- [Discord Server](https://discord.gg/myglambeauty)
- [GitHub Discussions](https://github.com/myglambeauty/supply/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/myglambeauty)

---

For additional help, contact the development team at dev@myglambeauty.com.
