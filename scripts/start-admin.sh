#!/bin/bash
echo "🚀 Starting Admin Panel on port 3001..."
cd apps/admin
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:4001
pnpm dev -p 3001
