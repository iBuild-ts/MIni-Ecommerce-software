import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private clients: Map<string, RateLimitRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getClientKey(req);
      const now = Date.now();
      const record = this.clients.get(key);

      // Clean up expired records
      this.cleanup();

      if (!record) {
        // First request from this client
        this.clients.set(key, {
          count: 1,
          resetTime: now + this.config.windowMs,
        });
        return next();
      }

      // Check if window has expired
      if (now > record.resetTime) {
        // Reset for new window
        record.count = 1;
        record.resetTime = now + this.config.windowMs;
        return next();
      }

      // Check if limit exceeded
      if (record.count >= this.config.maxRequests) {
        const resetIn = Math.ceil((record.resetTime - now) / 1000);
        
        res.set({
          'X-RateLimit-Limit': this.config.maxRequests,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': record.resetTime,
        });

        return res.status(429).json({
          error: this.config.message,
          retryAfter: resetIn,
        });
      }

      // Increment counter
      record.count++;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': this.config.maxRequests,
        'X-RateLimit-Remaining': this.config.maxRequests - record.count,
        'X-RateLimit-Reset': record.resetTime,
      });

      // Handle response based on config
      const originalSend = res.send.bind(res);
      const rateLimitConfig = this.config; // Store config for closure access
      res.send = function(this: Response, ...args: any[]): Response {
        const statusCode = this.statusCode;
        
        // Skip counting based on config
        if ((rateLimitConfig.skipSuccessfulRequests && statusCode < 400) ||
            (rateLimitConfig.skipFailedRequests && statusCode >= 400)) {
          record.count--;
        }
        
        return originalSend(...args);
      };

      next();
    };
  }

  private getClientKey(req: Request): string {
    // Use IP address as the default key
    // In production, you might want to use user ID for authenticated users
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.clients.entries()) {
      if (now > record.resetTime) {
        this.clients.delete(key);
      }
    }
  }

  // Get current rate limit stats
  getStats() {
    this.cleanup();
    return {
      totalClients: this.clients.size,
      clients: Array.from(this.clients.entries()).map(([key, record]) => ({
        key,
        count: record.count,
        resetTime: record.resetTime,
        resetIn: Math.max(0, record.resetTime - Date.now()),
      })),
    };
  }

  // Reset specific client
  resetClient(key: string) {
    this.clients.delete(key);
  }

  // Reset all clients
  resetAll() {
    this.clients.clear();
  }
}

// Predefined rate limiters
export const createRateLimiter = (config: RateLimitConfig) => new RateLimiter(config);

// Common rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // 50 attempts per 15 minutes (increased for development)
  message: 'Too many authentication attempts, please try again later.',
});

export const generalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // 1000 requests per 15 minutes (increased from 100)
  message: 'Too many requests, please try again later.',
});

export const strictRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});

export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 uploads per hour
  message: 'Upload limit exceeded, please try again later.',
});
