import { Controller, Get, Headers, UseFilters } from '@nestjs/common';
import { Observable } from 'rxjs';

import { CACHE_CONTROL_NO_CACHE } from '../constants/cache-control.constants';
import { Flight } from '../models/flight.model';
import { AggregatorService } from '../services/aggregator/aggregator.service';
import { ErrorFilter } from './error.filter';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Get()
  @UseFilters(ErrorFilter)
  getData(
    @Headers('Cache-Control') cacheControl: string
  ): Observable<Flight[]> {
    return this.aggregatorService.getAggregatedFlights(
      cacheControl === CACHE_CONTROL_NO_CACHE
    );
  }
}
