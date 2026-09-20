import Redis from 'ioredis';

const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (!url || url.includes('your-redis-url') || url.includes('placeholder')) {
    return null;
  }
  return url;
};

// Use a global variable to prevent creating multiple connections in development mode
const globalForRedis = global as unknown as {
  redis: any | undefined;
};

// In-memory mock for local development without Redis
class MockRedis {
  private store = new Map<string, string>();
  
  async get(key: string) {
    return this.store.get(key) || null;
  }
  
  async setex(key: string, seconds: number, value: string) {
    this.store.set(key, value);
    setTimeout(() => {
      this.store.delete(key);
    }, seconds * 1000);
    return 'OK';
  }
  
  async del(key: string) {
    this.store.delete(key);
    return 1;
  }
}

const redisUrl = getRedisUrl();
export const redis = globalForRedis.redis ?? (redisUrl ? new Redis(redisUrl) : new MockRedis());

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
