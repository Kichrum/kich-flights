import {
  CACHE_MANAGER,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { catchError, Observable, throwError } from 'rxjs';

import { ALL_SOURCES_FAILED_ERROR } from './constants/errors.constants';
import { Flight } from './models/flight.model';
import { AggregatorService } from './services/aggregator/aggregator.service';

@Controller('aggregator')
export class AggregatorController {
  constructor(
    private readonly aggregatorService: AggregatorService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @Get()
  getData(): Observable<Flight[]> {
    return this.aggregatorService
      .getAggregatedFlights()
      .pipe(
        catchError(() =>
          throwError(
            () =>
              new HttpException(
                ALL_SOURCES_FAILED_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR
              )
          )
        )
      );
  }

  /**
   * Tech endpoint to reset the cache database for easier testing
   */
  @Get('reset')
  async reset(): Promise<{ message: string }> {
    await this.cacheManager.reset();
    return { message: 'Cache reset successfully' };
  }
}
