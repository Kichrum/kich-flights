import { DynamicModule, Module } from '@nestjs/common';
import { AggregatorController } from './aggregator.controller';
import { ENVIRONMENT_TOKEN } from './constants';
import { Environment } from './models';

@Module({})
export class AggregatorModule {
  static register(environment: Environment): DynamicModule {
    return {
      module: AggregatorModule,
      controllers: [AggregatorController],
      providers: [
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: environment,
        },
      ],
    };
  }
}
