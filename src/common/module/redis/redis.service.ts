import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IRedisService } from './interface/IRedisSevice';

@Injectable()
export class RedisService implements IRedisService {
  private readonly store: Record<string, string> = {};

  get: (key: string) => Promise<string | null> = async (key) => {
    return this.store[key] || null;
  };

  set: (key: string, value: string, ttl: number) => Promise<void> = async (
    key,
    value,
    ttl,
  ) => {
    this.store[key] = value;

    if (ttl) {
      setTimeout(() => {
        this.del(key);
      }, ttl);
    }
  };

  del: (key: string) => Promise<void> = async (key) => {
    delete this.store[key];
  };
}
