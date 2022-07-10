import { Test } from '@nestjs/testing';
import { of } from 'rxjs';

import { AggregatorController } from './aggregator.controller';
import { CACHE_CONTROL_NO_CACHE } from '../constants/cache-control.constants';
import { MOCK_FLIGHTS } from '../mocks/flights.mocks';
import { Flight } from '../models/flight.model';
import { AggregatorService } from '../services/aggregator/aggregator.service';

describe('AggregatorController', () => {
  let controller: AggregatorController;
  let aggregatorService: AggregatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: AggregatorService,
          useValue: {
            getAggregatedFlights: jest.fn().mockReturnValue(of(MOCK_FLIGHTS)),
          },
        },
      ],
      controllers: [AggregatorController],
    }).compile();

    controller = module.get<AggregatorController>(AggregatorController);
    aggregatorService = module.get<AggregatorService>(AggregatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should fetch data', () => {
    let flights: Flight[];

    controller.getData(null).subscribe((res) => (flights = res));

    expect(flights).toEqual(MOCK_FLIGHTS);
  });

  it('should reset cache', () => {
    controller.getData(CACHE_CONTROL_NO_CACHE).subscribe();

    expect(aggregatorService.getAggregatedFlights).toHaveBeenCalledWith(true);
  });
});
