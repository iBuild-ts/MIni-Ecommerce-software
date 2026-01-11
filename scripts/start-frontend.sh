#!/bin/bash
echo "🚀 Starting Frontend (Web App) on port 3002..."
cd apps/web
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:4001
pnpm dev -p 3002
