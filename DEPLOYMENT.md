# MYGlamBeauty - Deployment Guide

This guide covers the deployment of the MYGlamBeauty beauty salon management system.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- pnpm
- kubectl (for Kubernetes deployment)
- Domain name and SSL certificates

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/myglambeauty-supply.git
cd myglambeauty-supply

# Install dependencies
pnpm install

# Start development environment
pnpm docker:up

# Run database migrations
pnpm db:migrate

# Access applications
# Web App: http://localhost:3000
# Admin Panel: http://localhost:3001
# API: http://localhost:4000
# MailHog: http://localhost:8025
```

## 📦 Production Deployment

### Environment Configuration

1. Copy the environment template:
```bash
cp .env.production.template .env.production
```

2. Update the environment variables with your actual values:
- Database credentials
- Redis password
- JWT secret
- Stripe keys
- SMTP configuration
- SSL certificate paths

### Docker Compose Deployment

```bash
# Build and deploy to production
pnpm deploy:production

# Or with custom options
./scripts/deploy.sh production [skip_tests] [skip_backup] [verbose]
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/production/

# Check deployment status
kubectl get pods -n myglambeauty

# Access services
kubectl port-forward svc/myglambeauty-api-service 4000:4000
```

## 🔧 Infrastructure Components

### Services

- **API Server** (Port 4000): Backend API with Express.js
- **Web App** (Port 3000): Customer-facing Next.js application
- **Admin Panel** (Port 3001): Admin dashboard for management
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Nginx**: Reverse proxy and load balancer

### Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Visualization and alerting
- **Health Checks**: Application health monitoring

### Security Features

- SSL/TLS encryption
- Rate limiting
- Security headers
- Container security
- Database encryption

## 📊 Monitoring and Logging

### Health Checks

- API Health: `GET /health`
- Readiness Check: `GET /ready`
- Liveness Check: `GET /live`

### Metrics

- Application metrics: `/metrics`
- Nginx metrics: `/nginx_metrics`
- Database metrics: PostgreSQL exporter

### Logs

- Application logs: JSON format
- Access logs: Nginx format
- Error logs: Structured logging

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline:

1. **Code Quality**: Linting, type checking, security scanning
2. **Testing**: Unit, integration, and E2E tests
3. **Build**: Docker image creation and optimization
4. **Security**: Vulnerability scanning and dependency checks
5. **Deploy**: Automated deployment to staging/production
6. **Monitoring**: Health checks and rollback capabilities

### Deployment Triggers

- **Push to develop**: Automatic staging deployment
- **Push to main**: Automatic production deployment
- **Pull requests**: Build and test validation

## 🛠️ Maintenance

### Database Maintenance

```bash
# Create backup
pnpm backup:create

# Restore backup
pnpm backup:restore

# Run migrations
pnpm db:migrate

# View database
pnpm db:studio
```

### Performance Monitoring

```bash
# View logs
pnpm docker:logs

# Monitor metrics
# Access Grafana: http://localhost:3002
# Access Prometheus: http://localhost:9090
```

### Security Updates

```bash
# Audit dependencies
pnpm security:audit

# Check for vulnerabilities
pnpm security:check
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials in environment file
   - Verify database container is running
   - Check network connectivity

2. **SSL Certificate Issues**
   - Verify certificate paths in Nginx config
   - Check certificate validity
   - Ensure proper file permissions

3. **High Memory Usage**
   - Check container resource limits
   - Monitor memory usage in Grafana
   - Consider scaling up resources

4. **Slow Performance**
   - Check Redis caching
   - Monitor database query performance
   - Review Nginx configuration

### Rollback Procedure

```bash
# Automatic rollback (if deployment fails)
./scripts/deploy.sh production false false true

# Manual rollback
kubectl rollout undo deployment/myglambeauty-api
kubectl rollout undo deployment/myglambeauty-web
kubectl rollout undo deployment/myglambeauty-admin
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale API service
kubectl scale deployment myglambeauty-api --replicas=5

# Scale web application
kubectl scale deployment myglambeauty-web --replicas=3
```

### Vertical Scaling

Update resource limits in deployment manifests:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## 🔐 Security Best Practices

1. **Regular Updates**: Keep dependencies and base images updated
2. **Access Control**: Implement proper RBAC for Kubernetes
3. **Secrets Management**: Use Kubernetes secrets or external secret managers
4. **Network Policies**: Implement network segmentation
5. **Monitoring**: Set up alerts for security events
6. **Backups**: Regular, encrypted backups with offsite storage

## 📞 Support

For deployment issues:

1. Check logs: `pnpm docker:logs`
2. Review health checks: `curl https://api.myglambeauty.com/health`
3. Monitor metrics: Grafana dashboard
4. Check CI/CD pipeline: GitHub Actions tab

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Grafana Visualization](https://grafana.com/docs/)
