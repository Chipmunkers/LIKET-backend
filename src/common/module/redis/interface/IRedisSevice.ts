export interface IRedisService {
  get: (key: string) => Promise<string | null>;

  set: (key: string, value: string, ttl?: number) => Promise<void>;

  del: (key: string) => Promise<void>;

  getSync: (key: string) => string | null;

  setSync: (key: string, value: string, ttl?: number) => void;

  delSync: (key: string) => void;
}
