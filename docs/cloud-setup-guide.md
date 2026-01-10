# Cloud Provider Setup Guide

## 🌐 Choosing Your Cloud Provider

### Recommended Options

#### 1. AWS (Amazon Web Services) - Recommended for Scale
**Pros:**
- Comprehensive service offerings
- Excellent reliability and performance
- Strong security features
- Global infrastructure
- Extensive documentation

**Estimated Cost:** $200-500/month for production setup

**Key Services:**
- EC2 for application servers
- RDS for PostgreSQL database
- ElastiCache for Redis
- S3 for file storage
- CloudFront for CDN
- Route 53 for DNS
- Certificate Manager for SSL

#### 2. Google Cloud Platform - Best for AI/ML
**Pros:**
- Excellent performance
- Strong data analytics
- Competitive pricing
- Google's network infrastructure

**Estimated Cost:** $150-400/month for production setup

#### 3. DigitalOcean - Best for Simplicity
**Pros:**
- Easy to use
- Competitive pricing
- Good documentation
- Simple setup

**Estimated Cost:** $100-250/month for production setup

## 🚀 AWS Setup Guide (Recommended)

### 1. Account Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region (us-west-2)
# Enter default output format (json)
```

### 2. VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=myglambeauty-vpc}]'

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-west-2a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=myglambeauty-public-1}]'
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone us-west-2b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=myglambeauty-public-2}]'

# Create internet gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=myglambeauty-igw}]'

# Attach internet gateway to VPC
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxxxxxx --internet-gateway-id igw-xxxxxxxxx
```

### 3. Database Setup (RDS)

```bash
# Create database subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name myglambeauty-subnet-group \
    --db-subnet-group-description "Subnet group for MYGlamBeauty" \
    --subnet-ids subnet-xxxxxxxxx subnet-xxxxxxxxx

# Create PostgreSQL database
aws rds create-db-instance \
    --db-instance-identifier myglambeauty-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username myglambeauty \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name myglambeauty-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --tag-specifications 'ResourceType=db-instance,Tags=[{Key=Name,Value=myglambeauty-db}]'
```

### 4. Redis Setup (ElastiCache)

```bash
# Create Redis subnet group
aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name myglambeauty-redis-subnet-group \
    --cache-subnet-group-description "Redis subnet group for MYGlamBeauty" \
    --subnet-ids subnet-xxxxxxxxx subnet-xxxxxxxxx

# Create Redis cluster
aws elasticache create-cache-cluster \
    --cache-cluster-id myglambeauty-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --security-group-ids sg-xxxxxxxxx \
    --cache-subnet-group-name myglambeauty-redis-subnet-group \
    --tag-specifications 'ResourceType=cache-cluster,Tags=[{Key=Name,Value=myglambeauty-redis}]'
```

### 5. Kubernetes Cluster (EKS)

```bash
# Create EKS cluster
aws eks create-cluster \
    --name myglambeauty-cluster \
    --version 1.28 \
    --role-arn arn:aws:iam::xxxxxxxxx:role/eksServiceRole \
    --resources-vpc-config subnetIds=subnet-xxxxxxxxx,subnet-xxxxxxxxx,securityGroupIds=sg-xxxxxxxxx

# Configure kubectl
aws eks update-kubeconfig --name myglambeauty-cluster --region us-west-2
```

### 6. File Storage (S3)

```bash
# Create S3 bucket
aws s3 mb s3://myglambeauty-prod-assets --region us-west-2

# Configure bucket for website hosting
aws s3 website s3://myglambeauty-prod-assets --index-document index.html --error-document error.html

# Set bucket policy
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::myglambeauty-prod-assets/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket myglambeauty-prod-assets --policy file://bucket-policy.json
```

### 7. CDN Setup (CloudFront)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 8. SSL Certificate

```bash
# Request SSL certificate
aws acm request-certificate \
    --domain-name myglambeauty.com \
    --subject-alternative-names www.myglambeauty.com \
    --validation-method DNS

# After DNS validation, get certificate ARN
aws acm describe-certificates --query 'CertificateSummaryList[?DomainName==`myglambeauty.com`]'
```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:

```bash
# Application
NODE_ENV=production
APP_NAME=MYGlamBeauty
APP_VERSION=1.2.0

# Database
DATABASE_URL=postgresql://myglambeauty:YourSecurePassword123!@myglambeauty-db.xxxxxxxxxx.us-west-2.rds.amazonaws.com:5432/myglambeauty

# Redis
REDIS_URL=redis://myglambeauty-redis.xxxxxxxxxx.0001.use1.cache.amazonaws.com:6379

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
JWT_EXPIRES_IN=7d

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=noreply@myglambeauty.com

# File Storage
AWS_S3_BUCKET=myglambeauty-prod-assets
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.myglambeauty.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key

# Security
CORS_ORIGIN=https://myglambeauty.com,https://www.myglambeauty.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=your_sentry_dsn_for_error_tracking
PROMETHEUS_URL=https://prometheus.myglambeauty.com
GRAFANA_URL=https://grafana.myglambeauty.com

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
MIXPANEL_TOKEN=your_mixpanel_token
```

## 🚀 Deployment Script

Create `scripts/deploy-aws.sh`:

```bash
#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    local level=$1
    shift
    local message="$*"
    
    case $level in
        "INFO") echo -e "${GREEN}[INFO]${NC} $message" ;;
        "WARN") echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log "ERROR" "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log "ERROR" "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log "ERROR" "Docker is not installed"
        exit 1
    fi
    
    log "INFO" "Prerequisites check passed"
}

# Build and push Docker images
build_and_push_images() {
    log "INFO" "Building and pushing Docker images..."
    
    # Login to ECR
    aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com
    
    # Build API image
    docker build -f packages/api/Dockerfile -t myglambeauty-api:latest .
    docker tag myglambeauty-api:latest xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-api:latest
    docker push xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-api:latest
    
    # Build Web image
    docker build -f apps/web/Dockerfile -t myglambeauty-web:latest .
    docker tag myglambeauty-web:latest xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-web:latest
    docker push xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-web:latest
    
    # Build Admin image
    docker build -f apps/admin/Dockerfile -t myglambeauty-admin:latest .
    docker tag myglambeauty-admin:latest xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-admin:latest
    docker push xxxxxxxxxxxx.dkr.ecr.us-west-2.amazonaws.com/myglambeauty-admin:latest
    
    log "INFO" "Docker images built and pushed successfully"
}

# Deploy to Kubernetes
deploy_to_kubernetes() {
    log "INFO" "Deploying to Kubernetes..."
    
    # Set context
    kubectl config use-context myglambeauty-cluster
    
    # Apply secrets
    kubectl apply -f k8s/production/secrets.yaml
    
    # Apply configurations
    kubectl apply -f k8s/production/configmaps.yaml
    kubectl apply -f k8s/production/
    
    # Wait for rollout
    log "INFO" "Waiting for rollout..."
    kubectl rollout status deployment/myglambeauty-api
    kubectl rollout status deployment/myglambeauty-web
    kubectl rollout status deployment/myglambeauty-admin
    
    log "INFO" "Kubernetes deployment completed"
}

# Health check
health_check() {
    log "INFO" "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f https://api.myglambeauty.com/health > /dev/null 2>&1; then
            log "INFO" "Health check passed"
            return 0
        fi
        
        log "WARN" "Health check failed (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    log "ERROR" "Health check failed after $max_attempts attempts"
    exit 1
}

# Main deployment function
main() {
    log "INFO" "Starting AWS deployment..."
    
    check_prerequisites
    build_and_push_images
    deploy_to_kubernetes
    health_check
    
    log "INFO" "AWS deployment completed successfully!"
    log "INFO" "Application is live at: https://myglambeauty.com"
}

# Execute deployment
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
```

## 📊 Cost Estimation

### Monthly AWS Costs (Production)

| Service | Instance Type | Monthly Cost |
|---------|---------------|--------------|
| EKS Cluster | Managed | $0.10/hour (~$73/month) |
| EC2 Nodes (3x) | t3.medium | $0.042/hour (~$91/month) |
| RDS PostgreSQL | db.t3.micro | $0.017/hour (~$13/month) |
| ElastiCache Redis | cache.t3.micro | $0.017/hour (~$13/month) |
| S3 Storage | 100GB | $2.30/month |
| CloudFront | Data Transfer | $10-50/month |
| Route 53 | Domain | $0.50/month |
| Certificate Manager | SSL | Free |
| **Total** | | **~$200-250/month** |

### Scaling Costs

| Users | Concurrent | EC2 Nodes | RDS | Monthly Cost |
|-------|------------|-----------|-----|--------------|
| 100-500 | 50 | 2x t3.medium | db.t3.micro | $150-200 |
| 500-1000 | 100 | 3x t3.medium | db.t3.small | $250-350 |
| 1000-5000 | 200 | 5x t3.medium | db.t3.medium | $400-600 |
| 5000+ | 500+ | Custom | Custom | $1000+ |

## 🔒 Security Configuration

### Security Groups

```bash
# Create security group for API
aws ec2 create-security-group \
    --group-name myglambeauty-api-sg \
    --description "Security group for MYGlamBeauty API" \
    --vpc-id vpc-xxxxxxxxx

# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Allow HTTPS traffic
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Allow SSH (restricted to your IP)
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP_ADDRESS/32
```

### IAM Roles

```bash
# Create IAM role for EKS
aws iam create-role \
    --role-name eksServiceRole \
    --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
    --role-name eksServiceRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

aws iam attach-role-policy \
    --role-name eksServiceRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonEKSServicePolicy
```

This setup provides a production-ready AWS environment with high availability, security, and scalability. The estimated monthly cost of $200-500 is competitive for enterprise-grade infrastructure.

**Next:** Would you like me to create the specific Kubernetes manifests for this AWS setup, or would you prefer to start with a simpler cloud provider like DigitalOcean?
