import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IRedisService } from './interface/IRedisSevice';

@Injectable()
export class RedisService implements IRedisService {
  private readonly store: Record<string, string> = {};

  /**
   * Store에 prefix가 겹치지 않기 위함.
   * 사용 가능한 캐싱 자료구조가 제한되어 있기 때문에 반드시 모든 캐싱에는 다음 STORE_PREFIX를 사용해야함
   *
   * @author jochongs
   */
  public static STORE_PREFIX = {
    /**
     * 컨텐츠 조회수 읽기 상태 전용 prefix.
     *
     * @author jochongs
     *
     * @example c-${userIdx}-${contentIdx}
     */
    CONTENT_VIEW_STATE: 'c',

    /**
     * 컨텐츠 조회수 전용 prefix
     *
     * @author jochongs
     *
     * @example v-${contentIdx}
     */
    CONTENT_VIEW_COUNT: 'v',
  };

  get: (key: string) => Promise<string | null> = async (key) => {
    return this.store[key] || null;
  };

  /**
   * 메모리에 key, value 데이터를 저장하는 메서드
   *
   * @author jochongs
   *
   * @param key 키 값
   * @param value 저장할 값
   * @param ttl 만료 시간 (ms)
   */
  set: (key: string, value: string, ttl?: number) => Promise<void> = async (
    key,
    value,
    ttl,
  ) => {
    this.store[key] = value;

    if (ttl) {
      this.setTTL(ttl, key);
    }
  };

  del: (key: string) => Promise<void> = async (key) => {
    delete this.store[key];
  };

  getSync: (key: string) => string | null = (key) => {
    return this.store[key] || null;
  };

  setSync: (key: string, value: string, ttl?: number) => void = (
    key,
    value,
    ttl,
  ) => {
    this.store[key] = value;

    if (ttl) {
      this.setTTL(ttl, key);
    }
  };

  private setTTL(ttl: number, key: string) {
    setTimeout(() => {
      this.del(key);
    }, ttl);
  }

  delSync: (key: string) => void = (key) => {
    delete this.store[key];
  };
}
