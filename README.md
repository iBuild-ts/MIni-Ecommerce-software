# MYGlamBeauty Supply

> Home of luxury beauty, handmade lashes for Queen Princess

A modern, scalable SaaS-style ecommerce platform built with Next.js, Express, Stripe, Postgres, and AI-powered customer assistance.

## 🏗️ Architecture

```
.
├── apps/
│   ├── web/          # Customer-facing storefront (Next.js)
│   ├── admin/        # Admin dashboard (Next.js)
│   └── ai-assistant/ # AI chat microservice
├── packages/
│   ├── api/          # Backend REST API (Express)
│   ├── db/           # Prisma schema & database client
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configurations
└── .env              # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database
- Stripe account

### Installation

1. **Clone and install dependencies:**
```bash
cd myglambeauty-supply
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Set up the database:**
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with demo data
pnpm db:seed
```

4. **Start development servers:**
```bash
pnpm dev
```

This will start:
- **Web app**: http://localhost:3000
- **Admin app**: http://localhost:3001
- **API server**: http://localhost:4000
- **AI Assistant**: http://localhost:4001

## 📦 Packages

### `@myglambeauty/web`
Customer-facing storefront with:
- Beautiful landing page with smooth animations
- Product catalog with filtering
- Shopping cart with Stripe checkout
- AI chat widget for customer support
- Booking system for appointments

### `@myglambeauty/admin`
Admin dashboard featuring:
- Product management (CRUD, images, inventory)
- Order management and fulfillment
- Customer CRM with tagging
- Lead management
- Email campaign composer
- Booking calendar
- Analytics dashboard

### `@myglambeauty/api`
Express backend with:
- JWT authentication
- Product, Order, Customer, Lead, Booking modules
- Stripe payment integration
- Analytics endpoints
- Webhook handlers

### `@myglambeauty/db`
Database layer with Prisma:
- PostgreSQL database
- Type-safe queries
- Migrations and seeding

### `@myglambeauty/ui`
Shared component library:
- Button, Input, Card, Badge components
- Utility functions (formatPrice, formatDate)
- Tailwind CSS styling

### `@myglambeauty/ai-assistant`
AI-powered customer service:
- Product search and recommendations
- Booking assistance
- Lead capture
- FAQ handling

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# JWT
JWT_SECRET="your-secret"

# AI
OPENAI_API_KEY="sk-..."

# URLs
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_WEB_URL="http://localhost:3000"
```

## 🛠️ Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio

# Build
pnpm build            # Build all packages

# Lint
pnpm lint             # Lint all packages
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Prisma, PostgreSQL
- **Payments**: Stripe
- **AI**: OpenAI GPT
- **State**: Zustand
- **Monorepo**: Turborepo, pnpm workspaces

## 📱 Features

### Customer Features
- ✨ Beautiful, responsive storefront
- 🛒 Seamless shopping cart experience
- 💳 Secure Stripe checkout
- 🤖 AI-powered chat assistant
- 📅 Online booking system
- 📧 Newsletter subscription

### Admin Features
- 📊 Real-time analytics dashboard
- 📦 Product & inventory management
- 📋 Order processing & fulfillment
- 👥 Customer relationship management
- 📧 Email marketing campaigns
- 📅 Booking management calendar

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Stripe webhook signature verification
- CORS protection
- Helmet security headers

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with 💖 for MYGlamBeauty Supply
