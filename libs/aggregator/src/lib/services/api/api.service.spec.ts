import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';

import { MOCK_FLIGHTS } from '../../mocks/flights.mocks';
import { Flight } from '../../models/flight.model';
import { ApiService } from './api.service';

const MOCK_URL = 'MOCK_URL';

describe('ApiService', () => {
  let service: ApiService;
  let httpService: HttpService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue(of({ data: { flights: MOCK_FLIGHTS } })),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockReturnValue(Promise.resolve()),
            set: jest.fn().mockReturnValue(Promise.resolve()),
            reset: jest.fn().mockReturnValue(Promise.resolve()),
          },
        },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call API if no cached value', async () => {
    let flights: Flight[];

    await service
      .fetchFlightsFromSource(MOCK_URL)
      .subscribe((res) => (flights = res));
    expect(httpService.get).toHaveBeenCalledWith(MOCK_URL);
    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should not call API if has cached value', async () => {
    let flights: Flight[];

    jest
      .spyOn(cacheManager, 'get')
      .mockReturnValue(Promise.resolve({ flights: MOCK_FLIGHTS }));

    await service
      .fetchFlightsFromSource(MOCK_URL)
      .subscribe((res) => (flights = res));
    expect(httpService.get).not.toHaveBeenCalled();
    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should update cache', async () => {
    await service.fetchFlightsFromSource(MOCK_URL).subscribe();
    expect(cacheManager.set).toHaveBeenCalledWith(MOCK_URL, {
      flights: MOCK_FLIGHTS,
    });
  });

  it('should refresh cache', () => {
    service.fetchFlightsFromSource(MOCK_URL, true).subscribe();

    expect(cacheManager.reset).toHaveBeenCalledTimes(1);
  });
});
