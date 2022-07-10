export const environment = {
  /**
   * Provide sources list to start aggregating.
   * @type string[]
   */
  sources: [],
  timeout: 900, // Assume 100 ms for transfers over network
  cacheTime: 60 * 60, // One hour in seconds
  redisHost: 'redis-19261.c279.us-central1-1.gce.cloud.redislabs.com',
  redisPort: 19261,
  /**
   * To enable Redis store set the token.
   * @type string
   */
  redisToken: null,
};
