export interface IRedisService {
  get: (key: string) => Promise<string | null>;

  set: (key: string, value: string, ttl?: number) => Promise<void>;

  del: (key: string) => Promise<void>;
}
