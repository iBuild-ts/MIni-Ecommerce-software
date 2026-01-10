# API Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY packages/api/package.json packages/api/pnpm-lock.yaml ./
COPY packages/db/package.json ./packages/db/
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY tsconfig.json ./

# Generate Prisma client
WORKDIR /app/packages/db
RUN pnpm prisma generate

# Build API
WORKDIR /app/packages/api
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/node_modules ./node_modules
COPY --from=builder /app/packages/api/package.json ./package.json
COPY --from=builder /app/packages/db ./packages/db

# Set permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js || exit 1

EXPOSE 4000

ENV PORT 4000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "dist/index.js"]
