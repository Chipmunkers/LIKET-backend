import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IRedisService } from './interface/IRedisSevice';

@Injectable()
export class RedisService implements IRedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

  get: (key: string) => Promise<string | null> = async (key) => {
    return (await this.redis.get(key)) || null;
  };

  set: (key: string, value: string, ttl: number) => Promise<void> = async (
    key,
    value,
    ttl,
  ) => {
    await this.redis.set(key, value, ttl);
  };

  del: (key: string) => Promise<void> = async (key) => {
    await this.redis.del(key);
  };
}
