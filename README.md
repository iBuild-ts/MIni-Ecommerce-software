# MYGlamBeauty - Complete Beauty Salon Management System

<div align="center">

![MYGlamBeauty Logo](https://via.placeholder.com/200x80/FF69B4/FFFFFF?text=MYGlamBeauty)

**A comprehensive, modern beauty salon management system built with Next.js, Node.js, and TypeScript**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

[Live Demo](https://myglambeauty.com) • [Documentation](./docs) • [API Reference](./docs/api) • [Deployment Guide](./DEPLOYMENT.md)

</div>

## 🌟 Overview

MYGlamBeauty is a full-featured beauty salon management system designed to streamline operations, enhance customer experience, and drive business growth. Built with modern technologies and best practices, it provides a complete solution for beauty salons of all sizes.

### ✨ Key Features

- **📅 Smart Booking System** - Online appointment scheduling with calendar integration
- **💳 Payment Processing** - Integrated Stripe payments with deposit management
- **🛍️ E-Commerce Platform** - Product sales with inventory management
- **👥 Customer Management** - Comprehensive CRM with communication tools
- **📊 Analytics Dashboard** - Real-time business insights and reporting
- **📱 Mobile Responsive** - Seamless experience across all devices
- **🔒 Enterprise Security** - Advanced security features and compliance
- **⚡ High Performance** - Optimized for speed and scalability

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Hook Form** - Form handling

**Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe API development
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

**Infrastructure:**
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Nginx** - Reverse proxy and load balancing
- **GitHub Actions** - CI/CD pipeline
- **Prometheus** - Monitoring and alerting
- **Grafana** - Visualization and dashboards

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Admin Panel   │    │   Mobile App    │
│   (Next.js)     │    │   (Next.js)     │    │   (React Native)│
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
│  PostgreSQL    │    │     Redis       │    │   File Storage  │
│   Database     │    │     Cache       │    │    (AWS S3)     │
└────────────────┘    └────────────────┘    └────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- PostgreSQL and Redis (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/myglambeauty-supply.git
cd myglambeauty-supply

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development environment
pnpm docker:up

# Run database migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

### Access the Applications

- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/docs
- **Database Studio**: http://localhost:5555

## 📖 Documentation

### User Guides
- [Customer Guide](./docs/customer-guide.md) - Using the web application
- [Admin Guide](./docs/admin-guide.md) - Managing the salon
- [Developer Guide](./docs/developer-guide.md) - Development setup

### Technical Documentation
- [API Reference](./docs/api/) - Complete API documentation
- [Database Schema](./docs/database.md) - Database design and relationships
- [Architecture Overview](./docs/architecture.md) - System architecture and design
- [Security Guide](./docs/security.md) - Security features and best practices

### Deployment
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Docker Guide](./docs/docker.md) - Container deployment
- [Kubernetes Guide](./docs/kubernetes.md) - K8s deployment and management

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test suites
pnpm test:api          # Backend tests
pnpm test:web          # Frontend tests
pnpm test:integration  # Integration tests
```

## 🔧 Development

### Project Structure

```
myglambeauty-supply/
├── apps/                    # Frontend applications
│   ├── web/                # Customer web app
│   └── admin/              # Admin dashboard
├── packages/               # Shared packages
│   ├── api/                # Backend API
│   ├── db/                 # Database schema and migrations
│   └── ui/                 # Shared UI components
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── k8s/                    # Kubernetes manifests
├── monitoring/             # Monitoring configuration
└── nginx/                  # Nginx configuration
```

### Common Commands

```bash
# Development
pnpm dev                  # Start all services in development
pnpm build                # Build all applications
pnpm start                # Start production server

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open database studio
pnpm db:seed              # Seed database with sample data

# Code Quality
pnpm lint                 # Run linting
pnpm type-check           # Check TypeScript types
pnpm format               # Format code with Prettier
pnpm security:audit       # Security audit
```

## 🌐 Deployment

### Development
```bash
pnpm docker:up            # Start with Docker Compose
```

### Production
```bash
pnpm deploy:staging       # Deploy to staging
pnpm deploy:production    # Deploy to production
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Monitoring

- **Grafana Dashboard**: http://localhost:3002 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Health Checks**: http://localhost:4000/health

## 🔒 Security

This application implements comprehensive security measures:

- **Authentication** - JWT-based auth with refresh tokens
- **Authorization** - Role-based access control (RBAC)
- **Data Protection** - Encryption at rest and in transit
- **API Security** - Rate limiting, CORS, and input validation
- **Infrastructure** - Container security and network policies

See [Security Guide](./docs/security.md) for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Excellent React framework
- **Prisma Team** - Modern database toolkit
- **Tailwind CSS** - Utility-first CSS framework
- **Stripe** - Payment processing platform
- **Vercel** - Hosting and deployment platform

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/myglambeauty-supply/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/myglambeauty-supply/discussions)
- **Email**: support@myglambeauty.com

## 🗺️ Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics and AI insights
- [ ] Multi-location support
- [ ] Advanced inventory management

### Version 2.1 (Q3 2024)
- [ ] Integration with popular salon software
- [ ] Advanced marketing automation
- [ ] Customer loyalty programs
- [ ] Staff scheduling and management

### Version 3.0 (Q4 2024)
- [ ] AI-powered recommendations
- [ ] Advanced reporting and BI
- [ ] Wholesale distribution platform
- [ ] International expansion

---
<div align="center">

**Built with ❤️ for the beauty industry**

[Website](https://myglambeauty.com) • [Documentation](./docs) • [Support](mailto:support@myglambeauty.com)

</div>
