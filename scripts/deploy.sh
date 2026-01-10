#!/bin/bash

# MYGlamBeauty Deployment Script
# Usage: ./deploy.sh [environment] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-staging}
SKIP_TESTS=${2:-false}
SKIP_BACKUP=${3:-false}
VERBOSE=${4:-false}

# Configuration
PROJECT_NAME="myglambeauty"
BACKUP_DIR="/backups"
LOG_FILE="/var/log/deploy.log"
HEALTH_CHECK_URL="https://api.myglambeauty.com/health"
ROLLBACK_URL="https://api.myglambeauty.com/rollback"

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "DEBUG")
            if [ "$VERBOSE" = true ]; then
                echo -e "${BLUE}[DEBUG]${NC} $message"
            fi
            ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> $LOG_FILE
}

# Error handling
error_exit() {
    log "ERROR" "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error_exit "Docker Compose is not installed"
    fi
    
    # Check if kubectl is installed (for Kubernetes deployment)
    if command -v kubectl &> /dev/null; then
        log "INFO" "kubectl found, Kubernetes deployment available"
        KUBERNETES=true
    else
        log "WARN" "kubectl not found, using Docker Compose deployment"
        KUBERNETES=false
    fi
    
    # Check environment file
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        error_exit "Environment file .env.$ENVIRONMENT not found"
    fi
    
    log "INFO" "Prerequisites check passed"
}

# Backup current deployment
backup_deployment() {
    if [ "$SKIP_BACKUP" = true ]; then
        log "WARN" "Skipping backup as requested"
        return
    fi
    
    log "INFO" "Creating backup of current deployment..."
    
    local backup_name="$PROJECT_NAME-$ENVIRONMENT-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p $backup_path
    
    # Backup database
    if [ "$ENVIRONMENT" != "development" ]; then
        log "INFO" "Backing up database..."
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $DATABASE_USER $DATABASE_NAME > "$backup_path/database.sql"
    fi
    
    # Backup configuration files
    cp .env.$ENVIRONMENT "$backup_path/.env"
    cp docker-compose.prod.yml "$backup_path/"
    
    # Backup current images
    docker images --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}\t{{.Size}}" | grep $PROJECT_NAME > "$backup_path/images.txt"
    
    log "INFO" "Backup created at $backup_path"
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

# Build Docker images
build_images() {
    log "INFO" "Building Docker images..."
    
    # Build API image
    log "INFO" "Building API image..."
    docker build -f packages/api/Dockerfile -t $PROJECT_NAME-api:latest .
    
    # Build Web image
    log "INFO" "Building Web image..."
    docker build -f apps/web/Dockerfile -t $PROJECT_NAME-web:latest .
    
    # Build Admin image
    log "INFO" "Building Admin image..."
    docker build -f apps/admin/Dockerfile -t $PROJECT_NAME-admin:latest .
    
    log "INFO" "Docker images built successfully"
}

# Deploy to Docker Compose
deploy_docker_compose() {
    log "INFO" "Deploying to Docker Compose..."
    
    # Load environment variables
    source .env.$ENVIRONMENT
    
    # Pull latest images
    log "INFO" "Pulling latest images..."
    docker-compose -f docker-compose.prod.yml pull
    
    # Deploy with zero downtime
    log "INFO" "Starting deployment..."
    docker-compose -f docker-compose.prod.yml up -d --no-deps api
    sleep 30
    
    # Deploy web apps
    docker-compose -f docker-compose.prod.yml up -d --no-deps web admin
    
    # Run database migrations
    log "INFO" "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec api pnpm prisma migrate deploy
    
    log "INFO" "Docker Compose deployment completed"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log "INFO" "Deploying to Kubernetes..."
    
    # Set context
    kubectl config use-context $ENVIRONMENT
    
    # Apply secrets
    log "INFO" "Applying secrets..."
    kubectl apply -f k8s/$ENVIRONMENT/secrets.yaml
    
    # Apply configurations
    log "INFO" "Applying configurations..."
    kubectl apply -f k8s/$ENVIRONMENT/configmaps.yaml
    kubectl apply -f k8s/$ENVIRONMENT/
    
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
        if curl -f $HEALTH_CHECK_URL > /dev/null 2>&1; then
            log "INFO" "Health check passed"
            return 0
        fi
        
        log "WARN" "Health check failed (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    error_exit "Health check failed after $max_attempts attempts"
}

# Rollback function
rollback() {
    log "ERROR" "Deployment failed, initiating rollback..."
    
    if [ "$KUBERNETES" = true ]; then
        kubectl rollout undo deployment/myglambeauty-api
        kubectl rollout undo deployment/myglambeauty-web
        kubectl rollout undo deployment/myglambeauty-admin
    else
        docker-compose -f docker-compose.prod.yml down
        # Restore from backup would go here
    fi
    
    log "INFO" "Rollback completed"
}

# Cleanup old images and containers
cleanup() {
    log "INFO" "Cleaning up old images and containers..."
    
    # Remove old Docker images
    docker image prune -f
    
    # Remove old containers
    docker container prune -f
    
    # Remove old volumes (be careful with this in production)
    if [ "$ENVIRONMENT" != "production" ]; then
        docker volume prune -f
    fi
    
    log "INFO" "Cleanup completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$status: $message\"}" \
            $SLACK_WEBHOOK
    fi
    
    if [ -n "$EMAIL_NOTIFICATIONS" ]; then
        # Send email notification
        echo "$message" | mail -s "$status deployment for $PROJECT_NAME" $EMAIL_NOTIFICATIONS
    fi
}

# Main deployment function
main() {
    log "INFO" "Starting deployment of $PROJECT_NAME to $ENVIRONMENT environment"
    
    # Check prerequisites
    check_prerequisites
    
    # Create backup
    backup_deployment
    
    # Run tests
    run_tests
    
    # Build images
    build_images
    
    # Deploy
    if [ "$KUBERNETES" = true ]; then
        deploy_kubernetes
    else
        deploy_docker_compose
    fi
    
    # Health check
    health_check || rollback
    
    # Cleanup
    cleanup
    
    # Send success notification
    send_notification "SUCCESS" "Deployment of $PROJECT_NAME to $ENVIRONMENT completed successfully"
    
    log "INFO" "Deployment completed successfully"
}

# Script execution
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
