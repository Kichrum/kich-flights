const ONE_SECOND_IN_MS = 1000;
const ONE_HOUR_IN_SECONDS = 60 * 60;

export const environment = {
  sources: [
    'https://coding-challenge.powerus.de/flight/source1',
    'https://coding-challenge.powerus.de/flight/source2',
  ],
  timeout: ONE_SECOND_IN_MS,
  cacheTime: ONE_HOUR_IN_SECONDS,
  production: false,
};
