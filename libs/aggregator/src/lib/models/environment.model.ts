export interface Environment {
  sources: string[];
  timeout: number;
  cacheTime: number;
  redisHost?: string;
  redisPort?: number;
  redisToken?: string;
}
