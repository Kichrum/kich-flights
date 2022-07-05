import { Inject, Injectable } from '@nestjs/common';
import {
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  of,
  throwError,
  timeout,
} from 'rxjs';

import { ENVIRONMENT_TOKEN } from '../../constants/environment-token.constant';
import { ALL_SOURCES_FAILED_ERROR_CODE } from '../../constants/errors.constants';
import { Environment } from '../../models/environment.model';
import { Flight } from '../../models/flight.model';
import { UniqueFlights } from '../../models/unique-flights.model';
import { ApiService } from '../api/api.service';

@Injectable()
export class AggregatorService {
  private errorsCount = 0;

  constructor(
    private readonly apiService: ApiService,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment
  ) {}

  getAggregatedFlights(): Observable<Flight[]> {
    const observables = this.flightObservables;
    return (observables.length ? combineLatest(observables) : of([])).pipe(
      map((flights) => new UniqueFlights(flights).data),
      finalize(() => (this.errorsCount = 0))
    );
  }

  private get flightObservables(): Observable<Flight[]>[] {
    return this.environment.sources.map((url) =>
      this.apiService
        .fetchFlightsFromSource(url)
        .pipe(timeout(this.environment.timeout), catchError(this.catchError))
    );
  }

  private catchError = (error): Observable<[]> => {
    this.errorsCount++;
    console.error(`Error #${this.errorsCount}`, error.message);
    if (this.errorsCount === this.environment.sources.length) {
      return throwError(() => new Error(ALL_SOURCES_FAILED_ERROR_CODE));
    }
    return of([]);
  };
}
