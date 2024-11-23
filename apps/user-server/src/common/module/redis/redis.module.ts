import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import redisConfig from './config/redis.config';

@Global()
@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
