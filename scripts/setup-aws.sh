#!/bin/bash

# MYGlamBeauty AWS Setup Script
# This script sets up all necessary AWS resources for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGION="us-west-2"
PROJECT_NAME="myglambeauty"
ENVIRONMENT="production"

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    
    case $level in
        "INFO") echo -e "${GREEN}[INFO]${NC} $message" ;;
        "WARN") echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $message" ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log "ERROR" "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log "ERROR" "kubectl is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log "ERROR" "AWS credentials are not configured. Run 'aws configure' first."
        exit 1
    fi
    
    log "INFO" "Prerequisites check passed"
}

# Create VPC and networking
create_vpc() {
    log "INFO" "Creating VPC and networking..."
    
    # Create VPC
    VPC_ID=$(aws ec2 create-vpc \
        --cidr-block 10.0.0.0/16 \
        --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$PROJECT_NAME-vpc}]" \
        --query "Vpc.VpcId" \
        --output text)
    
    log "INFO" "Created VPC: $VPC_ID"
    
    # Create internet gateway
    IGW_ID=$(aws ec2 create-internet-gateway \
        --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-igw}]" \
        --query "InternetGateway.InternetGatewayId" \
        --output text)
    
    log "INFO" "Created Internet Gateway: $IGW_ID"
    
    # Attach internet gateway
    aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
    
    # Create subnets
    PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.1.0/24 \
        --availability-zone ${REGION}a \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-1}]" \
        --query "Subnet.SubnetId" \
        --output text)
    
    PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.2.0/24 \
        --availability-zone ${REGION}b \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-2}]" \
        --query "Subnet.SubnetId" \
        --output text)
    
    PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.3.0/24 \
        --availability-zone ${REGION}a \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-1}]" \
        --query "Subnet.SubnetId" \
        --output text)
    
    PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.4.0/24 \
        --availability-zone ${REGION}b \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-2}]" \
        --query "Subnet.SubnetId" \
        --output text)
    
    log "INFO" "Created subnets: $PUBLIC_SUBNET_1, $PUBLIC_SUBNET_2, $PRIVATE_SUBNET_1, $PRIVATE_SUBNET_2"
    
    # Create route table
    ROUTE_TABLE_ID=$(aws ec2 create-route-table \
        --vpc-id $VPC_ID \
        --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-rt}]" \
        --query "RouteTable.RouteTableId" \
        --output text)
    
    # Add route to internet gateway
    aws ec2 create-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
    
    # Associate route table with public subnets
    aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $PUBLIC_SUBNET_1
    aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $PUBLIC_SUBNET_2
    
    # Save IDs for later use
    echo "VPC_ID=$VPC_ID" > /tmp/aws-ids.txt
    echo "IGW_ID=$IGW_ID" >> /tmp/aws-ids.txt
    echo "PUBLIC_SUBNET_1=$PUBLIC_SUBNET_1" >> /tmp/aws-ids.txt
    echo "PUBLIC_SUBNET_2=$PUBLIC_SUBNET_2" >> /tmp/aws-ids.txt
    echo "PRIVATE_SUBNET_1=$PRIVATE_SUBNET_1" >> /tmp/aws-ids.txt
    echo "PRIVATE_SUBNET_2=$PRIVATE_SUBNET_2" >> /tmp/aws-ids.txt
    echo "ROUTE_TABLE_ID=$ROUTE_TABLE_ID" >> /tmp/aws-ids.txt
    
    log "INFO" "VPC and networking setup completed"
}

# Create EKS cluster
create_eks_cluster() {
    log "INFO" "Creating EKS cluster..."
    
    # Create IAM role for EKS
    aws iam create-role \
        --role-name ${PROJECT_NAME}-eks-service-role \
        --assume-role-policy-document file://<(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
)
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name ${PROJECT_NAME}-eks-service-role \
        --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
    
    aws iam attach-role-policy \
        --role-name ${PROJECT_NAME}-eks-service-role \
        --policy-arn arn:aws:iam::aws:policy/AmazonEKSServicePolicy
    
    # Wait for role to be created
    sleep 10
    
    # Create EKS cluster
    CLUSTER_NAME="${PROJECT_NAME}-cluster"
    
    aws eks create-cluster \
        --name $CLUSTER_NAME \
        --version 1.28 \
        --role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/${PROJECT_NAME}-eks-service-role \
        --resources-vpc-config subnetIds=$PUBLIC_SUBNET_1,$PUBLIC_SUBNET_2,securityGroupIds=sg-0599c6d4a6c748e32 \
        --tags Key=Name,Value=$PROJECT_NAME-cluster
    
    log "INFO" "EKS cluster creation initiated. This will take 15-20 minutes..."
    
    # Wait for cluster to be ready
    aws eks wait cluster-active --name $CLUSTER_NAME
    
    log "INFO" "EKS cluster is ready"
    
    # Configure kubectl
    aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION
    
    # Create node group
    aws eks create-nodegroup \
        --cluster-name $CLUSTER_NAME \
        --nodegroup-name ${PROJECT_NAME}-nodegroup \
        --scaling-config minSize=3,maxSize=5,desiredSize=3 \
        --subnets $PUBLIC_SUBNET_1,$PUBLIC_SUBNET_2 \
        --instance-types t3.medium \
        --ami-type AL2_x86_64 \
        --disk-size 20 \
        --tags Key=Name,Value=$PROJECT_NAME-nodegroup
    
    log "INFO" "Node group creation initiated. This will take 10-15 minutes..."
    
    # Wait for node group to be ready
    aws eks wait nodegroup-active --cluster-name $CLUSTER_NAME --nodegroup-name ${PROJECT_NAME}-nodegroup
    
    log "INFO" "Node group is ready"
    
    echo "CLUSTER_NAME=$CLUSTER_NAME" >> /tmp/aws-ids.txt
}

# Create RDS database
create_rds_database() {
    log "INFO" "Creating RDS database..."
    
    # Create subnet group
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
        --db-subnet-group-description "Subnet group for $PROJECT_NAME" \
        --subnet-ids $PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2
    
    # Create security group
    DB_SG_ID=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-db-sg \
        --description "Security group for $PROJECT_NAME database" \
        --vpc-id $VPC_ID \
        --query "GroupId" \
        --output text)
    
    # Allow database access from within VPC
    aws ec2 authorize-security-group-ingress \
        --group-id $DB_SG_ID \
        --protocol tcp \
        --port 5432 \
        --cidr 10.0.0.0/16
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    # Create database
    DB_INSTANCE_IDENTIFIER="${PROJECT_NAME}-db"
    
    aws rds create-db-instance \
        --db-instance-identifier $DB_INSTANCE_IDENTIFIER \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.4 \
        --master-username myglambeauty \
        --master-user-password $DB_PASSWORD \
        --allocated-storage 20 \
        --storage-type gp2 \
        --storage-encrypted \
        --vpc-security-group-ids $DB_SG_ID \
        --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
        --backup-retention-period 7 \
        --multi-az \
        --deletion-protection \
        --tags Key=Name,Value=$PROJECT_NAME-db
    
    log "INFO" "RDS database creation initiated. This will take 10-15 minutes..."
    
    # Wait for database to be available
    aws rds wait db-instance-available --db-instance-identifier $DB_INSTANCE_IDENTIFIER
    
    # Get database endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_IDENTIFIER \
        --query "DBInstances[0].Endpoint.Address" \
        --output text)
    
    log "INFO" "Database is ready at: $DB_ENDPOINT"
    
    echo "DB_INSTANCE_IDENTIFIER=$DB_INSTANCE_IDENTIFIER" >> /tmp/aws-ids.txt
    echo "DB_ENDPOINT=$DB_ENDPOINT" >> /tmp/aws-ids.txt
    echo "DB_PASSWORD=$DB_PASSWORD" >> /tmp/aws-ids.txt
    echo "DB_SG_ID=$DB_SG_ID" >> /tmp/aws-ids.txt
}

# Create ElastiCache Redis
create_redis() {
    log "INFO" "Creating ElastiCache Redis..."
    
    # Create subnet group
    aws elasticache create-cache-subnet-group \
        --cache-subnet-group-name ${PROJECT_NAME}-redis-subnet-group \
        --cache-subnet-group-description "Redis subnet group for $PROJECT_NAME" \
        --subnet-ids $PRIVATE_SUBNET_1,$PRIVATE_SUBNET_2
    
    # Create security group
    REDIS_SG_ID=$(aws ec2 create-security-group \
        --group-name ${PROJECT_NAME}-redis-sg \
        --description "Security group for $PROJECT_NAME Redis" \
        --vpc-id $VPC_ID \
        --query "GroupId" \
        --output text)
    
    # Allow Redis access from within VPC
    aws ec2 authorize-security-group-ingress \
        --group-id $REDIS_SG_ID \
        --protocol tcp \
        --port 6379 \
        --cidr 10.0.0.0/16
    
    # Create Redis cluster
    REDIS_CLUSTER_ID="${PROJECT_NAME}-redis"
    
    aws elasticache create-cache-cluster \
        --cache-cluster-id $REDIS_CLUSTER_ID \
        --cache-node-type cache.t3.micro \
        --engine redis \
        --num-cache-nodes 1 \
        --security-group-ids $REDIS_SG_ID \
        --cache-subnet-group-name ${PROJECT_NAME}-redis-subnet-group \
        --tags Key=Name,Value=$PROJECT_NAME-redis
    
    log "INFO" "Redis cluster creation initiated. This will take 5-10 minutes..."
    
    # Wait for Redis to be available
    aws elasticache wait cache-cluster-available --cache-cluster-id $REDIS_CLUSTER_ID
    
    # Get Redis endpoint
    REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
        --cache-cluster-id $REDIS_CLUSTER_ID \
        --show-cache-node-info \
        --query "CacheClusters[0].CacheNodes[0].Endpoint.Address" \
        --output text)
    
    log "INFO" "Redis is ready at: $REDIS_ENDPOINT"
    
    echo "REDIS_CLUSTER_ID=$REDIS_CLUSTER_ID" >> /tmp/aws-ids.txt
    echo "REDIS_ENDPOINT=$REDIS_ENDPOINT" >> /tmp/aws-ids.txt
    echo "REDIS_SG_ID=$REDIS_SG_ID" >> /tmp/aws-ids.txt
}

# Create S3 bucket
create_s3_bucket() {
    log "INFO" "Creating S3 bucket..."
    
    S3_BUCKET_NAME="${PROJECT_NAME}-prod-assets"
    
    # Create bucket (with region-specific handling)
    if [ "$REGION" = "us-east-1" ]; then
        aws s3 mb s3://$S3_BUCKET_NAME
    else
        aws s3 mb s3://$S3_BUCKET_NAME --region $REGION
    fi
    
    # Configure bucket for website hosting
    aws s3 website s3://$S3_BUCKET_NAME \
        --index-document index.html \
        --error-document error.html
    
    # Set bucket policy for public read
    cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $S3_BUCKET_NAME \
        --policy file:///tmp/bucket-policy.json
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket $S3_BUCKET_NAME \
        --versioning-configuration Status=Enabled
    
    log "INFO" "S3 bucket created: $S3_BUCKET_NAME"
    
    echo "S3_BUCKET_NAME=$S3_BUCKET_NAME" >> /tmp/aws-ids.txt
}

# Create ECR repository
create_ecr_repositories() {
    log "INFO" "Creating ECR repositories..."
    
    # Get account ID
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_BASE_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    
    # Create repositories
    for repo in api web admin; do
        aws ecr create-repository \
            --repository-name ${PROJECT_NAME}-${repo} \
            --image-scanning-configuration scanOnPush=true \
            --tags Key=Name,Value=${PROJECT_NAME}-${repo}
        
        log "INFO" "Created ECR repository: ${PROJECT_NAME}-${repo}"
    done
    
    echo "ECR_BASE_URL=$ECR_BASE_URL" >> /tmp/aws-ids.txt
}

# Create IAM role for Kubernetes
create_kubernetes_iam_role() {
    log "INFO" "Creating IAM role for Kubernetes..."
    
    # Create IAM role for service accounts
    aws iam create-role \
        --role-name ${PROJECT_NAME}-k8s-service-role \
        --assume-role-policy-document file://<(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):oidc-provider/oidc.eks.${REGION}.amazonaws.com/id/$(aws eks describe-cluster --name ${PROJECT_NAME}-cluster --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)"
      },
      "Action": "sts:AssumeRoleWithWebIdentity"
    }
  ]
}
EOF
)
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name ${PROJECT_NAME}-k8s-service-role \
        --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
    
    aws iam attach-role-policy \
        --role-name ${PROJECT_NAME}-k8s-service-role \
        --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
    
    log "INFO" "Created IAM role for Kubernetes"
}

# Install required addons
install_addons() {
    log "INFO" "Installing Kubernetes addons..."
    
    # Install AWS Load Balancer Controller
    kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update
    helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
        -n kube-system \
        --set clusterName=${PROJECT_NAME}-cluster \
        --set serviceAccount.create=true \
        --set serviceAccount.name=aws-load-balancer-controller
    
    # Install cert-manager
    kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    
    # Install ingress-nginx
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        -n ingress-nginx \
        --create-namespace
    
    log "INFO" "Kubernetes addons installed"
}

# Generate environment file
generate_env_file() {
    log "INFO" "Generating environment file..."
    
    # Read saved IDs
    source /tmp/aws-ids.txt
    
    # Generate .env.production file
    cat > .env.production << EOF
# AWS Configuration
AWS_DEFAULT_REGION=$REGION
AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)

# Database
DATABASE_URL=postgresql://myglambeauty:$DB_PASSWORD@$DB_ENDPOINT:5432/myglambeauty

# Redis
REDIS_URL=redis://$REDIS_ENDPOINT:6379

# Application
NODE_ENV=production
APP_NAME=$PROJECT_NAME
APP_VERSION=1.2.0

# JWT (generate a secure secret)
JWT_SECRET=$(openssl rand -base64 32)

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.myglambeauty.com

# AWS S3
AWS_S3_BUCKET=$S3_BUCKET_NAME
AWS_REGION=$REGION

# CORS
CORS_ORIGIN=https://myglambeauty.com,https://www.myglambeauty.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    
    log "INFO" "Environment file generated: .env.production"
    log "WARN" "Please update the following values in .env.production:"
    log "WARN" "- STRIPE_SECRET_KEY (from Stripe dashboard)"
    log "WARN" "- STRIPE_PUBLISHABLE_KEY (from Stripe dashboard)"
    log "WARN" "- STRIPE_WEBHOOK_SECRET (from Stripe dashboard)"
    log "WARN" "- SMTP_HOST, SMTP_USER, SMTP_PASS (from email provider)"
    log "WARN" "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (from Stripe dashboard)"
}

# Print summary
print_summary() {
    log "INFO" "AWS setup completed successfully!"
    log "INFO" ""
    log "INFO" "Created resources:"
    source /tmp/aws-ids.txt
    
    log "INFO" "- VPC: $VPC_ID"
    log "INFO" "- EKS Cluster: $CLUSTER_NAME"
    log "INFO" "- Database: $DB_ENDPOINT"
    log "INFO" "- Redis: $REDIS_ENDPOINT"
    log "INFO" "- S3 Bucket: $S3_BUCKET_NAME"
    log "INFO" "- ECR Registry: $ECR_BASE_URL"
    
    log "INFO" ""
    log "INFO" "Next steps:"
    log "INFO" "1. Update .env.production with your Stripe and SMTP credentials"
    log "INFO" "2. Run: pnpm deploy:aws-production"
    log "INFO" "3. Configure your domain DNS records"
    log "INFO" "4. Access your applications at:"
    log "INFO" "   - Web: https://myglambeauty.com"
    log "INFO" "   - Admin: https://admin.myglambeauty.com"
    log "INFO" "   - API: https://api.myglambeauty.com"
    
    log "INFO" ""
    log "INFO" "Resource IDs saved in: /tmp/aws-ids.txt"
    log "INFO" "Environment file: .env.production"
}

# Main function
main() {
    log "INFO" "Starting AWS setup for $PROJECT_NAME..."
    
    check_prerequisites
    create_vpc
    create_eks_cluster
    create_rds_database
    create_redis
    create_s3_bucket
    create_ecr_repositories
    create_kubernetes_iam_role
    install_addons
    generate_env_file
    print_summary
    
    log "INFO" "AWS setup completed successfully!"
}

# Error handling
trap 'log "ERROR" "AWS setup failed. Check logs for details."' ERR

# Execute main function
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
