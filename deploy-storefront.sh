#!/bin/bash

echo "🚀 Deploying Storefront to Vercel..."

# Change to the correct directory
cd /Users/horlahdefi/CascadeProjects/myglambeauty-supply/apps/web

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

# Deploy using Vercel CLI with explicit path
echo "🌍 Deploying to Vercel..."
npx vercel --prod --cwd /Users/horlahdefi/CascadeProjects/myglambeauty-supply/apps/web

echo "✅ Deployment complete!"
