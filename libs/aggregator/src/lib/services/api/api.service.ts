import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  of,
  timeout,
} from 'rxjs';
import { ENVIRONMENT_TOKEN } from '../../constants/environment-token.constant';
import { reduceUniqueFlights } from '../../helpers/reduce-unique-flights.helper';
import { Environment } from '../../models/environment.model';
import { Flight, FlightsApiResponse } from '../../models/flight.model';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment
  ) {}

  fetchFlights(): Observable<Flight[]> {
    const errors = [];
    const flightObservables = [].concat(this.environment.sources).map((url) =>
      this.fetchFlightsFromSource(url).pipe(
        timeout(this.environment.timeout),
        catchError((error) => {
          errors.push(error);
          console.error(`Error #${errors.length}`, error.message);
          if (errors.length === this.environment.sources.length) {
            throw new HttpException(
              'All sources failed',
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
          return of([]);
        })
      )
    );
    return combineLatest([...flightObservables]).pipe(
      map((flights) => reduceUniqueFlights(flights)),
      finalize(() => {
        errors.splice(0, errors.length);
      })
    );
  }

  private fetchFlightsFromSource(url: string): Observable<Flight[]> {
    return this.httpService
      .get<FlightsApiResponse>(url)
      .pipe(map((response) => response.data.flights));
  }
}
