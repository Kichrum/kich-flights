const ONE_SECOND_IN_MS = 1000;
const ONE_HOUR_IN_SECONDS = 60 * 60;

export const environment = {
  sources: [
    'https://coding-challenge.powerus.de/flight/source1',
    'https://coding-challenge.powerus.de/flight/source2',
  ],
  timeout: ONE_SECOND_IN_MS,
  cacheTime: ONE_HOUR_IN_SECONDS,
  redisHost: 'redis-19261.c279.us-central1-1.gce.cloud.redislabs.com',
  redisPort: 19261,
  /**
   * To enable Redis store set the token.
   */
  // redisToken: null,
};
