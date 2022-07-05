import { Test, TestingModule } from '@nestjs/testing';
import { catchError, delay, of, throwError } from 'rxjs';

import { ENVIRONMENT_TOKEN } from '../../constants/environment-token.constant';
import {
  ALL_SOURCES_FAILED_ERROR,
  ALL_SOURCES_FAILED_ERROR_CODE,
} from '../../constants/errors.constants';
import { MOCK_FLIGHTS, MOCK_FLIGHTS_2 } from '../../mocks/flights.mocks';
import { Flight } from '../../models/flight.model';
import { ApiService } from '../api/api.service';
import { AggregatorService } from './aggregator.service';

const TIMEOUT = 1000;

describe('AggregatorService', () => {
  let service: AggregatorService;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AggregatorService,
        {
          provide: ApiService,
          useValue: {
            fetchFlightsFromSource: jest.fn().mockReturnValue(of(MOCK_FLIGHTS)),
          },
        },
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: {
            sources: ['1', '2'],
            timeout: TIMEOUT,
          },
        },
      ],
    }).compile();

    service = module.get<AggregatorService>(AggregatorService);
    apiService = module.get<ApiService>(ApiService);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get aggregated flights', () => {
    let flights: Flight[];

    service.getAggregatedFlights().subscribe((res) => (flights = res));

    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should call API for each source', () => {
    service.getAggregatedFlights().subscribe();

    expect(apiService.fetchFlightsFromSource).toHaveBeenCalledTimes(2);
  });

  it('should ignore the source that respond slowly', () => {
    let flights: Flight[];

    jest
      .spyOn(apiService, 'fetchFlightsFromSource')
      .mockReturnValueOnce(of(MOCK_FLIGHTS_2).pipe(delay(TIMEOUT + 1)));
    jest.spyOn(console, 'error').mockReturnValue();

    jest.useFakeTimers();
    service.getAggregatedFlights().subscribe((res) => (flights = res));
    jest.advanceTimersByTime(TIMEOUT);

    expect(flights).toEqual(MOCK_FLIGHTS);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Error #1',
      'Timeout has occurred'
    );
  });

  it('should fail if both sources respond slowly', () => {
    let flightsError: Error;

    jest
      .spyOn(apiService, 'fetchFlightsFromSource')
      .mockReturnValue(of(MOCK_FLIGHTS_2).pipe(delay(TIMEOUT + 1)));
    jest.spyOn(console, 'error').mockReturnValue();

    jest.useFakeTimers();
    service
      .getAggregatedFlights()
      .pipe(
        catchError((error) => {
          flightsError = error;
          return null;
        })
      )
      .subscribe();

    expect(() => jest.advanceTimersByTime(TIMEOUT + 1)).toThrow();
    expect(flightsError).toEqual(new Error(ALL_SOURCES_FAILED_ERROR_CODE));
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(
      'Error #1',
      'Timeout has occurred'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error #2',
      'Timeout has occurred'
    );
  });

  it('should ignore if some of sources errored', () => {
    let flights: Flight[];

    jest
      .spyOn(apiService, 'fetchFlightsFromSource')
      .mockReturnValueOnce(throwError(() => new Error('Some error')));

    service.getAggregatedFlights().subscribe((res) => (flights = res));

    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should fail if all sources errored', () => {
    let flightsError: Error;

    jest
      .spyOn(apiService, 'fetchFlightsFromSource')
      .mockReturnValue(throwError(() => new Error('Some error')));

    service
      .getAggregatedFlights()
      .pipe(
        catchError((error) => {
          flightsError = error;
          return null;
        })
      )
      .subscribe();

    expect(flightsError).toEqual(new Error(ALL_SOURCES_FAILED_ERROR_CODE));
  });
});
