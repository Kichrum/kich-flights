import { memoize } from 'lodash';

import { Flight } from '../models/flight.model';

const getFlightId = memoize((flight: Flight): string =>
  flight.slices.reduce(
    (acc, slice) =>
      [acc, slice.flight_number, slice.departure_date_time_utc].join('-'),
    ''
  )
);

export const reduceUniqueFlights = (flights: Flight[][]): Flight[] => {
  const uniqueFlights = new Map<string, Flight>();
  flights
    .reduce((acc, curr) => acc.concat(curr), [])
    .forEach((flight) => {
      uniqueFlights.set(getFlightId(flight), flight);
    });
  return Array.from(uniqueFlights.values());
};
