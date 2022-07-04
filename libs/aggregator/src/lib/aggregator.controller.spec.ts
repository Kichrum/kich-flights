import { Test } from '@nestjs/testing';
import { AggregatorController } from './aggregator.controller';

describe('AggregatorController', () => {
  let controller: AggregatorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [AggregatorController],
    }).compile();

    controller = module.get(AggregatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
