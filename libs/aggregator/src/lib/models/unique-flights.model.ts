import { memoize } from 'lodash';

import { Flight } from './flight.model';

export class UniqueFlights {
  readonly data: Flight[];

  constructor(private readonly rawData: Flight[][]) {
    this.data = this.reduceUniqueFlights();
  }

  private reduceUniqueFlights(): Flight[] {
    const uniqueFlights = new Map<string, Flight>();
    this.rawData
      .reduce((acc, curr) => acc.concat(curr), [])
      .forEach((flight) => {
        uniqueFlights.set(UniqueFlights.calcFlightId(flight), flight);
      });
    return Array.from(uniqueFlights.values());
  }

  private static calcFlightId = memoize((flight: Flight): string =>
    flight.slices.reduce(
      (acc, slice) =>
        [acc, slice.flight_number, slice.departure_date_time_utc].join('-'),
      ''
    )
  );
}
