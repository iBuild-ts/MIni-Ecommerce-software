#!/bin/bash

# MYGlamBeauty Local Development Launcher

echo "🚀 Starting MYGlamBeauty Local Development Server..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_warning "Please run this script from the project root directory"
    exit 1
fi

# Set environment variables
export NODE_ENV=development
export DATABASE_URL="file:./dev.db"

print_header "📦 Installing Dependencies..."
pnpm install

print_header "🗄️ Setting up Database..."
# Generate Prisma client
cd packages/db
pnpm prisma generate
cd ../..

# Create SQLite database for local development
mkdir -p packages/db
cd packages/db
if [ ! -f "dev.db" ]; then
    touch dev.db
    print_status "Created SQLite database"
fi
cd ../..

print_header "🔧 Starting Services..."

# Start API server in background
print_status "Starting API server on port 4000..."
cd packages/api
pnpm dev > ../../logs/api.log 2>&1 &
API_PID=$!
cd ../..

# Wait a moment for API to start
sleep 3

# Start Web app in background
print_status "Starting Web app on port 3000..."
cd apps/web
pnpm dev > ../../logs/web.log 2>&1 &
WEB_PID=$!
cd ../..

# Wait a moment for Web app to start
sleep 3

# Start Admin app in background
print_status "Starting Admin app on port 3001..."
cd apps/admin
pnpm dev > ../../logs/admin.log 2>&1 &
ADMIN_PID=$!
cd ../..

print_header "✅ Services Started Successfully!"
echo ""
echo "🌐 Your MYGlamBeauty applications are now running:"
echo "   • Web App:     http://localhost:3000"
echo "   • Admin Panel: http://localhost:3001"
echo "   • API Server:  http://localhost:4000"
echo ""
echo "📊 API Endpoints:"
echo "   • Health Check: http://localhost:4000/health"
echo "   • API Docs:     http://localhost:4000/api"
echo ""
echo "📝 Logs:"
echo "   • API:  logs/api.log"
echo "   • Web:  logs/web.log"
echo "   • Admin: logs/admin.log"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-local.sh"
echo ""
echo "🎉 Happy coding! Your local MYGlamBeauty is ready!"

# Save PIDs to file for stopping later
echo "$API_PID" > .api.pid
echo "$WEB_PID" > .web.pid
echo "$ADMIN_PID" > .admin.pid

# Create logs directory
mkdir -p logs

# Keep script running or exit based on argument
if [ "$1" != "--detached" ]; then
    print_header "📋 Monitoring Services..."
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    trap 'echo ""; print_header "🛑 Stopping Services..."; kill $API_PID $WEB_PID $ADMIN_PID 2>/dev/null; rm -f .api.pid .web.pid .admin.pid; print_status "All services stopped"; exit 0' INT
    
    # Monitor processes
    while true; do
        sleep 5
        if ! kill -0 $API_PID 2>/dev/null; then
            print_warning "API server stopped unexpectedly"
            break
        fi
        if ! kill -0 $WEB_PID 2>/dev/null; then
            print_warning "Web app stopped unexpectedly"
            break
        fi
        if ! kill -0 $ADMIN_PID 2>/dev/null; then
            print_warning "Admin app stopped unexpectedly"
            break
        fi
    done
fi
