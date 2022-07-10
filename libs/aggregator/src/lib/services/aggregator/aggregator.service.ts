import { Inject, Injectable } from '@nestjs/common';
import { catchError, forkJoin, map, Observable, of, timeout } from 'rxjs';

import { ENVIRONMENT_TOKEN } from '../../constants/environment-token.constant';
import { ErrorCode } from '../../enums/error-code.enum';
import { reduceUniqueFlights } from '../../helpers/reduce-unique-flights.helper';
import { Environment } from '../../models/environment.model';
import { Flight } from '../../models/flight.model';
import { ApiService } from '../api/api.service';

@Injectable()
export class AggregatorService {
  constructor(
    private readonly apiService: ApiService,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment
  ) {}

  getAggregatedFlights(refreshCache?: boolean): Observable<Flight[]> {
    const observables = this.getFlightObservables(refreshCache);
    if (!observables.length) {
      return of([]);
    }
    return forkJoin(observables).pipe(
      map(AggregatorService.filterErrors),
      map(reduceUniqueFlights)
    );
  }

  private static filterErrors = (sourcesFlights: Flight[][]): Flight[][] => {
    const filtered: Flight[][] = sourcesFlights.filter(Boolean);
    if (!filtered.length) {
      throw new Error(ErrorCode.AllSourcesFailed);
    }
    return filtered;
  };

  private getFlightObservables(refreshCache?: boolean): Observable<Flight[]>[] {
    return this.environment.sources.map((url) =>
      this.apiService
        .fetchFlightsFromSource(url, refreshCache)
        .pipe(
          timeout(this.environment.timeout),
          catchError(AggregatorService.catchError)
        )
    );
  }

  private static catchError = (error): Observable<[]> => {
    console.error('Error', error.message);
    return of(null);
  };
}
