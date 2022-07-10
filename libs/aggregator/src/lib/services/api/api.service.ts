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

  fetchFlightsFromSource(
    url: string,
    refreshCache?: boolean
  ): Observable<Flight[]> {
    return this.fetchDataFromUrl<FlightsApiResponse>(url, refreshCache).pipe(
      map((response) => response.flights)
    );
  }

  private fetchDataFromUrl<T>(
    url: string,
    refreshCache = false
  ): Observable<T> {
    return from(
      refreshCache
        ? this.cacheManager.reset().then(() => null)
        : this.cacheManager.get(url)
    ).pipe(
      switchMap((cachedData: T) =>
        cachedData
          ? of(cachedData)
          : this.httpService.get<T>(url).pipe(
              map((response) => response.data),
              tap((responseData) => {
                console.log('Updating cache for source', url);
                void this.cacheManager.set(url, responseData);
              })
            )
      )
    );
  }
}
