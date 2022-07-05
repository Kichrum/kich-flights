import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Cache } from 'cache-manager';
import { Flight, FlightsApiResponse } from '../../models/flight.model';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  fetchFlightsFromSource(url: string): Observable<Flight[]> {
    return from(this.cacheManager.get(url)).pipe(
      switchMap((cachedFlights: Flight[]) =>
        cachedFlights
          ? of(cachedFlights)
          : this.httpService.get<FlightsApiResponse>(url).pipe(
              map((response) => response.data.flights),
              tap((flights) => {
                console.log('Updating cache for source', url);
                void this.cacheManager.set(url, flights);
              })
            )
      )
    );
  }
}
