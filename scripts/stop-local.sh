#!/bin/bash

# MYGlamBeauty Local Development Stopper

echo "🛑 Stopping MYGlamBeauty Local Development Server..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Stop services using saved PIDs
if [ -f ".api.pid" ]; then
    API_PID=$(cat .api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        kill $API_PID
        print_status "Stopped API server (PID: $API_PID)"
    else
        print_warning "API server was not running"
    fi
    rm -f .api.pid
else
    print_warning "API server PID file not found"
fi

if [ -f ".web.pid" ]; then
    WEB_PID=$(cat .web.pid)
    if kill -0 $WEB_PID 2>/dev/null; then
        kill $WEB_PID
        print_status "Stopped Web app (PID: $WEB_PID)"
    else
        print_warning "Web app was not running"
    fi
    rm -f .web.pid
else
    print_warning "Web app PID file not found"
fi

if [ -f ".admin.pid" ]; then
    ADMIN_PID=$(cat .admin.pid)
    if kill -0 $ADMIN_PID 2>/dev/null; then
        kill $ADMIN_PID
        print_status "Stopped Admin app (PID: $ADMIN_PID)"
    else
        print_warning "Admin app was not running"
    fi
    rm -f .admin.pid
else
    print_warning "Admin app PID file not found"
fi

# Force kill any remaining processes on ports 3000, 3001, 4000
print_status "Cleaning up any remaining processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true

echo ""
print_status "✅ All MYGlamBeauty services stopped successfully!"
echo ""
echo "📝 Logs are still available in the logs/ directory"
echo "🚀 To start again, run: ./scripts/start-local.sh"
