# MYGlamBeauty - Knowledge Transfer Document

## Overview

This document serves as a comprehensive knowledge transfer guide for the MYGlamBeauty beauty salon management system. It contains all essential information for team members, maintainers, and future developers.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technical Architecture](#technical-architecture)
3. [Business Logic](#business-logic)
4. [Key Components](#key-components)
5. [Operational Procedures](#operational-procedures)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Contact Information](#contact-information)

## System Overview

### Business Domain

MYGlamBeauty is a comprehensive beauty salon management system that provides:

- **Appointment Booking** - Online scheduling with calendar integration
- **Payment Processing** - Stripe integration with deposit management
- **E-Commerce** - Product sales with inventory management
- **Customer Management** - CRM with communication tools
- **Analytics** - Business insights and reporting
- **Staff Management** - Employee scheduling and performance tracking

### User Roles

1. **Customer** - End users booking appointments and purchasing products
2. **Staff** - Salon employees managing appointments and services
3. **Admin** - Business owners with full system access
4. **Super Admin** - System administrators with technical access

### Key Business Workflows

1. **Booking Flow:**
   - Customer browses available services
   - Selects date/time and provides details
   - Pays deposit (if required)
   - Receives confirmation email
   - Staff manages appointment

2. **Payment Flow:**
   - Customer adds products to cart
   - Proceeds to checkout
   - Enters payment details
   - Processes via Stripe
   - Receives confirmation

3. **Inventory Flow:**
   - Admin adds products to catalog
   - Sets stock levels and pricing
   - System tracks sales and updates inventory
   - Low stock alerts generated

## Technical Architecture

### Technology Stack

**Frontend Applications:**
- **Web App** (Next.js 14) - Customer-facing application
- **Admin Panel** (Next.js 14) - Management dashboard
- **Shared UI** (React + Tailwind) - Reusable components

**Backend Services:**
- **API Server** (Express.js + TypeScript) - RESTful API
- **Database** (PostgreSQL + Prisma) - Primary data store
- **Cache** (Redis) - Session storage and caching
- **Email** (Nodemailer) - Transactional emails

**Infrastructure:**
- **Containerization** (Docker) - Application containers
- **Orchestration** (Kubernetes) - Production deployment
- **Reverse Proxy** (Nginx) - Load balancing and SSL
- **Monitoring** (Prometheus + Grafana) - Observability

### System Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Admin Panel   │    │   Mobile App    │
│   (Next.js)     │    │   (Next.js)     │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway         │
                    │       (Nginx)             │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Server          │
                    │    (Express.js)          │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│  PostgreSQL    │    │     Redis       │    │ External APIs   │
│   Database     │    │     Cache       │    │  (Stripe, SMTP) │
└────────────────┘    └────────────────┘    └────────────────┘
```

### Data Flow

1. **User Request** → Nginx (Load Balancer)
2. **API Gateway** → Route to appropriate service
3. **Application Server** → Business logic processing
4. **Database** → Data persistence
5. **Cache** → Performance optimization
6. **External Services** → Third-party integrations

## Business Logic

### Booking System

**Core Entities:**
- **Booking** - Appointment records
- **Customer** - Client information
- **Service** - Available services
- **Staff** - Service providers

**Business Rules:**
- Bookings require minimum 24 hours notice
- Deposit required for appointments over $100
- Cancellations within 24 hours forfeit deposit
- Staff can only be booked during working hours
- Maximum 4 bookings per customer per day

**Key Algorithms:**
```typescript
// Time slot availability check
async function isTimeSlotAvailable(
  staffId: string, 
  startTime: Date, 
  duration: number
): Promise<boolean> {
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      staffId,
      status: { not: 'CANCELLED' },
      OR: [
        {
          scheduledFor: { lt: endTime },
          // Calculate end time for each booking
        },
        {
          scheduledFor: { gt: startTime },
        },
      ],
    },
  });
  
  return conflictingBookings.length === 0;
}
```

### Payment System

**Payment Flow:**
1. Customer initiates payment
2. Create payment intent with Stripe
3. Customer confirms payment
4. Webhook confirms payment completion
5. Update order status and send confirmation

**Security Measures:**
- PCI compliance through Stripe
- Webhook signature verification
- Payment method tokenization
- Fraud detection integration

### Inventory Management

**Stock Tracking:**
- Real-time inventory updates
- Low stock alerts (threshold: 10 units)
- Automatic reorder suggestions
- Batch tracking for expiration

**Pricing Logic:**
- Base price + service fees
- Dynamic pricing for peak hours
- Discount rules and promotions
- Tax calculations by location

## Key Components

### Frontend Architecture

**Next.js App Router Structure:**
```
src/app/
├── (auth)/              # Authentication routes
│   ├── login/
│   └── register/
├── (dashboard)/         # Protected routes
│   ├── bookings/
│   ├── products/
│   └── analytics/
├── api/                 # API routes
├── globals.css
├── layout.tsx
└── page.tsx
```

**State Management:**
- **Zustand** for client state
- **React Query** for server state
- **Context API** for authentication
- **Local Storage** for persistence

**Component Library:**
```typescript
// Example: Reusable Button component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
}) => {
  // Component implementation
};
```

### Backend Architecture

**Express.js Structure:**
```
src/
├── controllers/         # Request handlers
├── services/           # Business logic
├── repositories/       # Data access
├── middleware/         # Custom middleware
├── routes/            # Route definitions
├── utils/             # Helper functions
└── types/             # TypeScript types
```

**Service Layer Pattern:**
```typescript
// Example: Booking service
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private emailService: EmailService,
    private paymentService: PaymentService
  ) {}

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    // Validate business rules
    await this.validateBookingData(data);
    
    // Check availability
    const isAvailable = await this.checkAvailability(data);
    if (!isAvailable) {
      throw new ConflictError('Time slot not available');
    }
    
    // Process payment if required
    if (data.requiresDeposit) {
      await this.processDeposit(data);
    }
    
    // Create booking
    const booking = await this.bookingRepository.create(data);
    
    // Send confirmation
    await this.emailService.sendBookingConfirmation(booking);
    
    return booking;
  }
}
```

### Database Schema

**Core Tables:**
```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES users(id),
  staff_id TEXT REFERENCES users(id),
  service_id TEXT REFERENCES services(id),
  scheduled_for TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  deposit_cents INTEGER,
  total_cents INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes and Performance:**
```sql
-- Performance indexes
CREATE INDEX idx_bookings_scheduled_for ON bookings(scheduled_for);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
```

## Operational Procedures

### Deployment Process

**Development Deployment:**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
pnpm install

# 3. Run database migrations
pnpm db:migrate

# 4. Build applications
pnpm build

# 5. Restart services
pnpm docker:down
pnpm docker:up
```

**Production Deployment:**
```bash
# 1. Run deployment script
./scripts/deploy.sh production

# 2. Monitor deployment
kubectl get pods -n myglambeauty

# 3. Verify health checks
curl https://api.myglambeauty.com/health

# 4. Check monitoring
# Grafana: https://monitoring.myglambeauty.com
```

### Database Management

**Backup Procedures:**
```bash
# Daily automated backups
0 2 * * * /scripts/backup.sh create

# Manual backup
./scripts/backup.sh create

# Restore backup
./scripts/backup.sh restore 2024-01-15
```

**Migration Process:**
```bash
# Create new migration
pnpm db:migration:add add_new_feature

# Review migration
# Check migration file in packages/db/prisma/migrations/

# Deploy to staging first
pnpm deploy:staging

# Test migration thoroughly
# Run smoke tests

# Deploy to production
pnpm deploy:production
```

### Monitoring and Alerting

**Key Metrics to Monitor:**
- **Application Performance:**
  - Response time (target: <200ms)
  - Error rate (target: <1%)
  - Throughput (requests per second)
  - Memory usage (target: <80%)

- **Business Metrics:**
  - Booking conversion rate
  - Payment success rate
  - Customer acquisition cost
  - Revenue per user

- **Infrastructure:**
  - CPU usage (alert: >80%)
  - Memory usage (alert: >85%)
  - Disk space (alert: >90%)
  - Database connections (alert: >80%)

**Alert Configuration:**
```yaml
# Prometheus alert rules
groups:
  - name: myglambeauty.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

## Troubleshooting Guide

### Common Issues

**1. Database Connection Errors**
```bash
# Symptoms: Application won't start, database errors
# Causes: Database down, connection pool exhausted, network issues

# Troubleshooting steps:
1. Check database status:
   kubectl get pods -n myglambeauty | grep postgres
   
2. Check database logs:
   kubectl logs -n myglambeauty deployment/postgres
   
3. Test connection:
   psql $DATABASE_URL -c "SELECT 1;"
   
4. Restart application:
   kubectl rollout restart deployment/api -n myglambeauty
```

**2. High Memory Usage**
```bash
# Symptoms: Slow performance, OOM errors
# Causes: Memory leaks, insufficient resources, inefficient queries

# Troubleshooting steps:
1. Check memory usage:
   kubectl top pods -n myglambeauty
   
2. Analyze heap dump:
   node --inspect dist/index.js
   
3. Check for memory leaks:
   pnpm test:performance
   
4. Optimize queries:
   pnpm db:analyze
```

**3. Payment Processing Issues**
```bash
# Symptoms: Payment failures, webhook errors
# Causes: API key issues, webhook misconfiguration, network problems

# Troubleshooting steps:
1. Verify Stripe configuration:
   curl https://api.stripe.com/v1/accounts -u sk_test_xxxx
   
2. Check webhook logs:
   kubectl logs -n myglambeauty deployment/api | grep webhook
   
3. Test webhook endpoint:
   stripe listen --forward-to localhost:4000/webhooks/stripe
   
4. Verify SSL certificates:
   openssl s_client -connect api.myglambeauty.com:443
```

### Emergency Procedures

**1. Production Outage**
```bash
# Immediate response:
1. Check status page: https://status.myglambeauty.com
2. Join incident channel: #incidents on Slack
3. Assess impact: Check monitoring dashboards
4. Communicate: Notify stakeholders

# Recovery steps:
1. Identify root cause from logs
2. Implement quick fix if possible
3. Deploy fix to production
4. Monitor for stability
5. Conduct post-mortem
```

**2. Data Corruption**
```bash
# Response procedure:
1. Stop all write operations:
   kubectl scale deployment/api --replicas=0
   
2. Assess damage:
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM bookings;"
   
3. Restore from backup:
   ./scripts/backup.sh restore latest
   
4. Verify data integrity:
   pnpm test:integration
   
5. Resume operations:
   kubectl scale deployment/api --replicas=3
```

**3. Security Incident**
```bash
# Immediate actions:
1. Change all API keys and secrets
2. Enable enhanced monitoring
3. Review access logs
4. Notify security team

# Investigation:
1. Analyze access patterns
2. Check for data exfiltration
3. Review recent deployments
4. Document findings

# Recovery:
1. Patch vulnerabilities
2. Reset user passwords
3. Implement additional security measures
4. Conduct security audit
```

## Contact Information

### Development Team

**Technical Lead:**
- Name: [Technical Lead Name]
- Email: tech-lead@myglambeauty.com
- Slack: @tech-lead
- Phone: +1-555-0123

**Backend Developer:**
- Name: [Backend Developer Name]
- Email: backend-dev@myglambeauty.com
- Slack: @backend-dev

**Frontend Developer:**
- Name: [Frontend Developer Name]
- Email: frontend-dev@myglambeauty.com
- Slack: @frontend-dev

**DevOps Engineer:**
- Name: [DevOps Engineer Name]
- Email: devops@myglambeauty.com
- Slack: @devops

### Business Stakeholders

**Product Owner:**
- Name: [Product Owner Name]
- Email: product-owner@myglambeauty.com
- Slack: @product-owner

**Business Manager:**
- Name: [Business Manager Name]
- Email: business-manager@myglambeauty.com
- Slack: @business-manager

### External Contacts

**Service Providers:**
- **Stripe Support**: support@stripe.com
- **Database Hosting**: support@database-provider.com
- **CDN Provider**: support@cdn-provider.com

**Emergency Contacts:**
- **On-call Engineer**: +1-555-0199 (24/7)
- **Security Team**: security@myglambeauty.com
- **Legal Team**: legal@myglambeauty.com

### Documentation Resources

**Internal Documentation:**
- Confluence Space: https://confluence.myglambeauty.com
- Wiki: https://wiki.myglambeauty.com
- Design System: https://design.myglambeauty.com

**External Documentation:**
- GitHub Repository: https://github.com/myglambeauty/supply
- API Documentation: https://docs.myglambeauty.com/api
- Status Page: https://status.myglambeauty.com

### Communication Channels

**Slack Channels:**
- #development - General development discussions
- #incidents - Production incidents
- #deployments - Deployment notifications
- #architecture - Technical architecture discussions
- #product - Product management

**Email Lists:**
- dev-team@myglambeauty.com - Development team
- stakeholders@myglambeauty.com - Business stakeholders
- incidents@myglambeauty.com - Incident notifications

**Meeting Schedule:**
- Daily Standup: 9:00 AM PST
- Sprint Planning: Every Monday, 10:00 AM PST
- Retrospective: Every Friday, 2:00 PM PST
- Architecture Review: First Thursday of month, 11:00 AM PST

## Training Materials

### New Developer Onboarding

**Week 1: Environment Setup**
- Set up development environment
- Review codebase structure
- Complete first bug fix
- Pair programming with mentor

**Week 2: System Overview**
- Learn business domain
- Review architecture documentation
- Set up local development environment
- Complete feature implementation

**Week 3: Advanced Topics**
- Database management
- Deployment procedures
- Monitoring and debugging
- Security best practices

**Week 4: Independent Work**
- Complete feature independently
- Participate in code review
- Deploy to staging
- Present to team

### Ongoing Education

**Technical Training:**
- Monthly tech talks
- Conference attendance
- Online course subscriptions
- Book club for technical books

**Business Training:**
- Beauty industry knowledge
- Customer service skills
- Product management basics
- Business acumen workshop

---

This knowledge transfer document is a living document that should be updated regularly as the system evolves. For questions or updates, contact the technical lead at tech-lead@myglambeauty.com.

**Last Updated:** January 10, 2024
**Next Review:** March 10, 2024
**Document Owner:** Technical Lead
