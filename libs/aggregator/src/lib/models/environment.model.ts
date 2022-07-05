interface FetchingConfig {
  cacheTime: number;
  sources: string[];
  timeout: number;
}

interface RedisConfig {
  redisHost: string;
  redisPort: number;
  redisToken: string;
}

export interface Environment extends FetchingConfig, Partial<RedisConfig> {}
