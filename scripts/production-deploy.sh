#!/bin/bash

# MYGlamBeauty Production Deployment Script
# Usage: ./scripts/production-deploy.sh [environment] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="myglambeauty"
VERSION=${1:-latest}
ENVIRONMENT=${2:-production}
SKIP_TESTS=${3:-false}
SKIP_BACKUP=${4:-false}
VERBOSE=${5:-false}

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO") echo -e "${GREEN}[INFO]${NC} $message" ;;
        "WARN") echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
        "DEBUG") 
            if [ "$VERBOSE" = true ]; then
                echo -e "${BLUE}[DEBUG]${NC} $message"
            fi
            ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> /var/log/deploy.log
}

# Error handling
error_exit() {
    log "ERROR" "$1"
    log "ERROR" "Deployment failed. Check logs for details."
    exit 1
}

# Success message
success_exit() {
    log "INFO" "Deployment completed successfully!"
    log "INFO" "Application is live at: https://myglambeauty.com"
    exit 0
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed"
    fi
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        error_exit "kubectl is not installed"
    fi
    
    # Check if AWS CLI is installed (for AWS deployment)
    if ! command -v aws &> /dev/null; then
        error_exit "AWS CLI is not installed"
    fi
    
    # Check environment file
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        error_exit "Environment file .env.$ENVIRONMENT not found"
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error_exit "AWS credentials not configured"
    fi
    
    log "INFO" "Prerequisites check passed"
}

# Load environment variables
load_environment() {
    log "INFO" "Loading environment variables..."
    
    if [ -f ".env.$ENVIRONMENT" ]; then
        export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
        log "INFO" "Environment variables loaded from .env.$ENVIRONMENT"
    else
        error_exit "Environment file .env.$ENVIRONMENT not found"
    fi
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        log "WARN" "Skipping tests as requested"
        return
    fi
    
    log "INFO" "Running tests..."
    
    # Run linting
    log "INFO" "Running linting..."
    pnpm lint || error_exit "Linting failed"
    
    # Run type checking
    log "INFO" "Running type checking..."
    pnpm type-check || error_exit "Type checking failed"
    
    # Run unit tests
    log "INFO" "Running unit tests..."
    pnpm test:ci || error_exit "Unit tests failed"
    
    # Run integration tests
    log "INFO" "Running integration tests..."
    pnpm test:integration || error_exit "Integration tests failed"
    
    log "INFO" "All tests passed"
}

# Create backup
create_backup() {
    if [ "$SKIP_BACKUP" = true ]; then
        log "WARN" "Skipping backup as requested"
        return
    fi
    
    log "INFO" "Creating backup..."
    
    local backup_name="$PROJECT_NAME-$ENVIRONMENT-$(date +%Y%m%d-%H%M%S)"
    local backup_dir="/backups/$backup_name"
    
    mkdir -p $backup_dir
    
    # Backup database
    if [ "$ENVIRONMENT" != "development" ]; then
        log "INFO" "Backing up database..."
        pg_dump $DATABASE_URL > "$backup_dir/database.sql" || error_exit "Database backup failed"
    fi
    
    # Backup configuration files
    cp .env.$ENVIRONMENT "$backup_dir/.env"
    cp docker-compose.prod.yml "$backup_dir/"
    cp k8s/production/*.yaml "$backup_dir/"
    
    # Upload to S3 (if configured)
    if [ -n "$AWS_S3_BACKUP_BUCKET" ]; then
        log "INFO" "Uploading backup to S3..."
        aws s3 sync $backup_dir s3://$AWS_S3_BACKUP_BUCKET/backups/$backup_name/
    fi
    
    log "INFO" "Backup created at $backup_dir"
}

# Build Docker images
build_images() {
    log "INFO" "Building Docker images..."
    
    # Build API image
    log "INFO" "Building API image..."
    docker build -f packages/api/Dockerfile -t $PROJECT_NAME-api:$VERSION . || error_exit "API image build failed"
    
    # Build Web image
    log "INFO" "Building Web image..."
    docker build -f apps/web/Dockerfile -t $PROJECT_NAME-web:$VERSION . || error_exit "Web image build failed"
    
    # Build Admin image
    log "INFO" "Building Admin image..."
    docker build -f apps/admin/Dockerfile -t $PROJECT_NAME-admin:$VERSION . || error_exit "Admin image build failed"
    
    log "INFO" "Docker images built successfully"
}

# Push images to registry
push_images() {
    log "INFO" "Pushing images to registry..."
    
    # Login to ECR
    local registry_id=$(aws sts get-caller-identity --query Account --output text)
    local ecr_url="$registry_id.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
    
    aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ecr_url
    
    # Tag and push API image
    docker tag $PROJECT_NAME-api:$VERSION $ecr_url/$PROJECT_NAME-api:$VERSION
    docker push $ecr_url/$PROJECT_NAME-api:$VERSION || error_exit "API image push failed"
    
    # Tag and push Web image
    docker tag $PROJECT_NAME-web:$VERSION $ecr_url/$PROJECT_NAME-web:$VERSION
    docker push $ecr_url/$PROJECT_NAME-web:$VERSION || error_exit "Web image push failed"
    
    # Tag and push Admin image
    docker tag $PROJECT_NAME-admin:$VERSION $ecr_url/$PROJECT_NAME-admin:$VERSION
    docker push $ecr_url/$PROJECT_NAME-admin:$VERSION || error_exit "Admin image push failed"
    
    log "INFO" "Images pushed to registry successfully"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log "INFO" "Deploying to Kubernetes..."
    
    # Set kubectl context
    kubectl config use-context $PROJECT_NAME-cluster || error_exit "Failed to set kubectl context"
    
    # Create namespace if it doesn't exist
    kubectl create namespace $ENVIRONMENT --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply secrets
    log "INFO" "Applying secrets..."
    kubectl apply -f k8s/production/secrets.yaml -n $ENVIRONMENT || error_exit "Failed to apply secrets"
    
    # Apply configmaps
    log "INFO" "Applying configmaps..."
    kubectl apply -f k8s/production/configmaps.yaml -n $ENVIRONMENT || error_exit "Failed to apply configmaps"
    
    # Update image tags in deployment files
    sed -i.bak "s|image: .*myglambeauty-api:.*|image: $ecr_url/$PROJECT_NAME-api:$VERSION|g" k8s/production/api-deployment.yaml
    sed -i.bak "s|image: .*myglambeauty-web:.*|image: $ecr_url/$PROJECT_NAME-web:$VERSION|g" k8s/production/web-deployment.yaml
    sed -i.bak "s|image: .*myglambeauty-admin:.*|image: $ecr_url/$PROJECT_NAME-admin:$VERSION|g" k8s/production/admin-deployment.yaml
    
    # Apply deployments
    log "INFO" "Applying deployments..."
    kubectl apply -f k8s/production/ -n $ENVIRONMENT || error_exit "Failed to apply deployments"
    
    # Wait for rollout
    log "INFO" "Waiting for rollout..."
    kubectl rollout status deployment/myglambeauty-api -n $ENVIRONMENT --timeout=300s || error_exit "API rollout failed"
    kubectl rollout status deployment/myglambeauty-web -n $ENVIRONMENT --timeout=300s || error_exit "Web rollout failed"
    kubectl rollout status deployment/myglambeauty-admin -n $ENVIRONMENT --timeout=300s || error_exit "Admin rollout failed"
    
    # Restore original deployment files
    mv k8s/production/api-deployment.yaml.bak k8s/production/api-deployment.yaml
    mv k8s/production/web-deployment.yaml.bak k8s/production/web-deployment.yaml
    mv k8s/production/admin-deployment.yaml.bak k8s/production/admin-deployment.yaml
    
    log "INFO" "Kubernetes deployment completed"
}

# Run database migrations
run_migrations() {
    log "INFO" "Running database migrations..."
    
    # Execute migrations in the API pod
    kubectl exec -n $ENVIRONMENT deployment/myglambeauty-api -- pnpm prisma migrate deploy || error_exit "Database migrations failed"
    
    log "INFO" "Database migrations completed"
}

# Health check
health_check() {
    log "INFO" "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    local health_url="https://api.myglambeauty.com/health"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f $health_url > /dev/null 2>&1; then
            log "INFO" "Health check passed"
            return 0
        fi
        
        log "WARN" "Health check failed (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    error_exit "Health check failed after $max_attempts attempts"
}

# Post-deployment verification
post_deployment_checks() {
    log "INFO" "Running post-deployment checks..."
    
    # Check pod status
    log "INFO" "Checking pod status..."
    kubectl get pods -n $ENVIRONMENT || error_exit "Failed to get pod status"
    
    # Check services
    log "INFO" "Checking services..."
    kubectl get services -n $ENVIRONMENT || error_exit "Failed to get services"
    
    # Check ingress
    log "INFO" "Checking ingress..."
    kubectl get ingress -n $ENVIRONMENT || error_exit "Failed to get ingress"
    
    # Test API endpoints
    log "INFO" "Testing API endpoints..."
    curl -f https://api.myglambeauty.com/health || error_exit "API health check failed"
    curl -f https://api.myglambeauty.com/api/products || error_exit "API products check failed"
    
    # Test web application
    log "INFO" "Testing web application..."
    curl -f https://myglambeauty.com || error_exit "Web application check failed"
    
    # Test admin panel
    log "INFO" "Testing admin panel..."
    curl -f https://admin.myglambeauty.com || error_exit "Admin panel check failed"
    
    log "INFO" "Post-deployment checks completed"
}

# Send notifications
send_notification() {
    local status=$1
    local message=$2
    
    # Slack notification
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$status: $message\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    # Email notification
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "$status deployment for $PROJECT_NAME" $NOTIFICATION_EMAIL
    fi
    
    log "INFO" "Notifications sent"
}

# Rollback function
rollback() {
    log "ERROR" "Deployment failed, initiating rollback..."
    
    # Rollback Kubernetes deployments
    kubectl rollout undo deployment/myglambeauty-api -n $ENVIRONMENT
    kubectl rollout undo deployment/myglambeauty-web -n $ENVIRONMENT
    kubectl rollout undo deployment/myglambeauty-admin -n $ENVIRONMENT
    
    # Wait for rollback
    kubectl rollout status deployment/myglambeauty-api -n $ENVIRONMENT
    kubectl rollout status deployment/myglambeauty-web -n $ENVIRONMENT
    kubectl rollout status deployment/myglambeauty-admin -n $ENVIRONMENT
    
    log "INFO" "Rollback completed"
    send_notification "ROLLBACK" "Production deployment was rolled back due to errors"
}

# Cleanup function
cleanup() {
    log "INFO" "Cleaning up..."
    
    # Remove temporary files
    rm -f /tmp/deployment-*.log
    
    # Clean up Docker images (optional)
    if [ "$CLEANUP_DOCKER" = true ]; then
        docker image prune -f
    fi
    
    log "INFO" "Cleanup completed"
}

# Main deployment function
main() {
    log "INFO" "Starting production deployment of $PROJECT_NAME (version: $VERSION)"
    log "INFO" "Environment: $ENVIRONMENT"
    
    # Set up error handling
    trap rollback ERR
    trap cleanup EXIT
    
    # Execute deployment steps
    check_prerequisites
    load_environment
    run_tests
    create_backup
    build_images
    push_images
    deploy_kubernetes
    run_migrations
    health_check
    post_deployment_checks
    
    # Send success notification
    send_notification "SUCCESS" "Production deployment of $PROJECT_NAME v$VERSION completed successfully"
    
    success_exit
}

# Script execution
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version)
                VERSION="$2"
                shift 2
                ;;
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --version VERSION     Set version (default: latest)"
                echo "  --environment ENV     Set environment (default: production)"
                echo "  --skip-tests          Skip running tests"
                echo "  --skip-backup         Skip creating backup"
                echo "  --verbose             Enable verbose logging"
                echo "  --help                Show this help message"
                exit 0
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    main "$@"
fi
