import { prisma } from '@myglambeauty/db';
import { performanceMonitor } from '../middleware/performance-monitor';
import { memoryCache } from '../services/cache.service';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  version: string;
  checks: {
    database: HealthCheckResult;
    cache: HealthCheckResult;
    memory: HealthCheckResult;
    performance: HealthCheckResult;
  };
  metrics: {
    responseTime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cacheSize: number;
    activeConnections: number;
  };
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  responseTime?: number;
  details?: any;
}

class HealthCheckService {
  private startTime: Date = new Date();
  private version: string = '1.0.0';

  async performHealthCheck(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    // Perform all health checks in parallel
    const [dbCheck, cacheCheck, memoryCheck, performanceCheck] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkMemory(),
      this.checkPerformance(),
    ]);

    const checks = {
      database: this.getCheckResult(dbCheck),
      cache: this.getCheckResult(cacheCheck),
      memory: this.getCheckResult(memoryCheck),
      performance: this.getCheckResult(performanceCheck),
    };

    // Determine overall status
    const statuses = Object.values(checks).map(c => c.status);
    const overallStatus = this.determineOverallStatus(statuses);

    const responseTime = Date.now() - startTime;

    return {
      status: overallStatus,
      timestamp: new Date(),
      uptime: Date.now() - this.startTime.getTime(),
      version: this.version,
      checks,
      metrics: {
        responseTime,
        memoryUsage: process.memoryUsage(),
        cacheSize: memoryCache.size(),
        activeConnections: this.getActiveConnections(),
      },
    };
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Simple database connection test
      await prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      if (responseTime > 1000) {
        return {
          status: 'degraded',
          message: 'Database response time is slow',
          responseTime,
        };
      }

      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  private async checkCache(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Test cache functionality
      const testKey = 'health_check_test';
      const testValue = { test: true, timestamp: Date.now() };
      
      memoryCache.set(testKey, testValue, 1000);
      const retrieved = memoryCache.get(testKey);
      memoryCache.delete(testKey);

      const responseTime = Date.now() - startTime;

      if (!retrieved) {
        return {
          status: 'unhealthy',
          message: 'Cache is not functioning properly',
          responseTime,
        };
      }

      return {
        status: 'healthy',
        message: 'Cache is functioning properly',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Cache check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  private async checkMemory(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;

    const responseTime = Date.now() - startTime;

    if (memoryUsagePercent > 90) {
      return {
        status: 'unhealthy',
        message: `Memory usage is critically high: ${memoryUsagePercent.toFixed(2)}%`,
        responseTime,
        details: {
          used: usedMemory,
          total: totalMemory,
          percentage: memoryUsagePercent,
        },
      };
    }

    if (memoryUsagePercent > 75) {
      return {
        status: 'degraded',
        message: `Memory usage is high: ${memoryUsagePercent.toFixed(2)}%`,
        responseTime,
        details: {
          used: usedMemory,
          total: totalMemory,
          percentage: memoryUsagePercent,
        },
      };
    }

    return {
      status: 'healthy',
      message: `Memory usage is normal: ${memoryUsagePercent.toFixed(2)}%`,
      responseTime,
      details: {
        used: usedMemory,
        total: totalMemory,
        percentage: memoryUsagePercent,
      },
    };
  }

  private async checkPerformance(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const stats = performanceMonitor.getPerformanceStats();
      const responseTime = Date.now() - startTime;

      if (stats.averageResponseTime > 2000) {
        return {
          status: 'degraded',
          message: `Average response time is slow: ${stats.averageResponseTime}ms`,
          responseTime,
          details: stats,
        };
      }

      if (stats.errorRate > 5) {
        return {
          status: 'degraded',
          message: `Error rate is high: ${stats.errorRate}%`,
          responseTime,
          details: stats,
        };
      }

      return {
        status: 'healthy',
        message: 'Performance metrics are within acceptable ranges',
        responseTime,
        details: stats,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Performance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  private getCheckResult(result: PromiseSettledResult<HealthCheckResult>): HealthCheckResult {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        status: 'unhealthy',
        message: `Health check failed: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`,
      };
    }
  }

  private determineOverallStatus(statuses: Array<'healthy' | 'degraded' | 'unhealthy'>): 'healthy' | 'degraded' | 'unhealthy' {
    if (statuses.some(s => s === 'unhealthy')) {
      return 'unhealthy';
    }
    
    if (statuses.some(s => s === 'degraded')) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  private getActiveConnections(): number {
    // Mock implementation - in a real app, you'd track actual connections
    return Math.floor(Math.random() * 10) + 1;
  }

  // Simple health check for load balancers
  async simpleHealthCheck(): Promise<{ status: string; timestamp: Date }> {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }

  // Readiness check - indicates if the service is ready to accept traffic
  async readinessCheck(): Promise<{ ready: boolean; checks: any }> {
    const dbCheck = await this.checkDatabase();
    const cacheCheck = await this.checkCache();
    
    const ready = dbCheck.status === 'healthy' && cacheCheck.status === 'healthy';
    
    return {
      ready,
      checks: {
        database: dbCheck.status,
        cache: cacheCheck.status,
      },
    };
  }

  // Liveness check - indicates if the service is still running
  async livenessCheck(): Promise<{ alive: boolean; uptime: number }> {
    return {
      alive: true,
      uptime: Date.now() - this.startTime.getTime(),
    };
  }
}

export const healthCheckService = new HealthCheckService();
