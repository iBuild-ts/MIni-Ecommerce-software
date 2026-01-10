interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    
    this.cache.set(key, item);
    
    // Auto-cleanup after TTL
    setTimeout(() => {
      this.delete(key);
    }, item.ttl);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }
    
    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    // Clean up expired items
    this.cleanup();
    return this.cache.size;
  }

  keys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    this.cleanup();
    return {
      size: this.cache.size,
      keys: this.keys(),
    };
  }
}

// Cache decorator for functions
export function Cache(ttl?: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new MemoryCache();

    descriptor.value = async function (...args: any[]) {
      const key = `${propertyName}_${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }
      
      // Execute function and cache result
      const result = await method.apply(this, args);
      cache.set(key, result, ttl);
      
      return result;
    };
  };
}

export const memoryCache = new MemoryCache();
