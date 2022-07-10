import { memoize } from 'lodash';

import { Flight } from '../models/flight.model';

const calcFlightId = memoize((flight: Flight): string =>
  flight.slices.reduce(
    (acc, slice) =>
      [acc, slice.flight_number, slice.departure_date_time_utc].join('-'),
    ''
  )
);

export const reduceUniqueFlights = (sourcesFlights: Flight[][]): Flight[] =>
  Array.from(
    sourcesFlights
      .flat()
      .reduce(
        (uniqueFlights, flight) =>
          uniqueFlights.set(calcFlightId(flight), flight),
        new Map<string, Flight>()
      )
      .values()
  );
