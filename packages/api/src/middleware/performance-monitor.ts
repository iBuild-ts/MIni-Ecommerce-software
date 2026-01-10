import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 requests

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Add request ID to response headers for tracking
      res.setHeader('X-Request-ID', requestId);

      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = function(this: Response, ...args: any[]) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const metric: PerformanceMetrics = {
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
          timestamp: new Date(),
          userAgent: req.get('User-Agent'),
          ip: req.ip || req.connection.remoteAddress,
        };

        // Store metric
        this.addMetric(metric);

        // Log slow requests
        if (responseTime > 1000) {
          console.warn(`🐌 Slow request: ${req.method} ${req.url} took ${responseTime}ms`);
        }

        // Call original end
        originalEnd.apply(this, args);
      }.bind(res);

      next();
    };
  }

  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getPerformanceStats() {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowestRequest: 0,
        fastestRequest: 0,
        errorRate: 0,
        requestsPerMinute: 0,
      };
    }

    const totalRequests = this.metrics.length;
    const responseTimes = this.metrics.map(m => m.responseTime);
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / totalRequests;
    const slowestRequest = Math.max(...responseTimes);
    const fastestRequest = Math.min(...responseTimes);
    const errorCount = this.metrics.filter(m => m.statusCode >= 400).length;
    const errorRate = (errorCount / totalRequests) * 100;

    // Calculate requests per minute (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentRequests = this.metrics.filter(m => m.timestamp > fiveMinutesAgo);
    const requestsPerMinute = recentRequests.length / 5;

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowestRequest,
      fastestRequest,
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerMinute: Math.round(requestsPerMinute * 100) / 100,
    };
  }

  getSlowRequests(limit = 10) {
    return this.metrics
      .filter(m => m.responseTime > 500) // Only requests slower than 500ms
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, limit);
  }

  getErrorRequests(limit = 10) {
    return this.metrics
      .filter(m => m.statusCode >= 400)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
