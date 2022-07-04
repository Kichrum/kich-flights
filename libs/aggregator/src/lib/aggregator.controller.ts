import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { ALL_SOURCES_FAILED_ERROR } from './constants/errors.constants';
import { Flight } from './models/flight.model';
import { AggregatorService } from './services/aggregator/aggregator.service';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

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
}
