import { CACHE_MANAGER, HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { catchError, of, throwError } from 'rxjs';
import { Cache } from 'cache-manager';

import { AggregatorController } from './aggregator.controller';
import { ALL_SOURCES_FAILED_ERROR } from './constants/errors.constants';
import { MOCK_FLIGHTS } from './mocks/flights.mocks';
import { Flight } from './models/flight.model';
import { AggregatorService } from './services/aggregator/aggregator.service';
import exp = require('constants');

describe('AggregatorController', () => {
  let controller: AggregatorController;
  let aggregatorService: AggregatorService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: AggregatorService,
          useValue: {
            getAggregatedFlights: jest.fn().mockReturnValue(of(MOCK_FLIGHTS)),
          },
        },
        { provide: CACHE_MANAGER, useValue: { reset: jest.fn() } },
      ],
      controllers: [AggregatorController],
    }).compile();

    controller = module.get<AggregatorController>(AggregatorController);
    aggregatorService = module.get<AggregatorService>(AggregatorService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should fetch data', () => {
    let flights: Flight[];

    controller.getData().subscribe((res) => (flights = res));

    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should handle errors', () => {
    let flightsError: HttpException;

    jest
      .spyOn(aggregatorService, 'getAggregatedFlights')
      .mockReturnValue(throwError(() => new Error()));

    controller
      .getData()
      .pipe(catchError((error) => (flightsError = error)))
      .subscribe();

    expect(flightsError.message).toBe(ALL_SOURCES_FAILED_ERROR.message);
    expect(flightsError instanceof HttpException).toBeTruthy();
  });

  it('should reset cache', () => {
    controller.reset();

    expect(cacheManager.reset).toHaveBeenCalledTimes(1);
  });
});
