#!/bin/bash
echo "🚀 Starting API Server on port 4001..."
cd packages/api
export NODE_ENV=development
export DATABASE_URL="file:./dev.db"
export JWT_SECRET=local-jwt-secret
pnpm dev
