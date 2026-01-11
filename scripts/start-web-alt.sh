#!/bin/bash

echo "🚀 Starting MYGlamBeauty Web App..."

# Set environment
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:4000

# Start the web app on port 3002 to avoid conflicts
echo "📱 Starting web app on http://localhost:3002"
cd apps/web
exec pnpm dev -p 3002
