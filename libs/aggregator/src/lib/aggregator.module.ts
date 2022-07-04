import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { AggregatorController } from './aggregator.controller';
import { ENVIRONMENT_TOKEN } from './constants/environment-token.constant';
import { Environment } from './models/environment.model';
import { ApiService } from './services/api/api.service';

@Module({})
export class AggregatorModule {
  static register(environment: Environment): DynamicModule {
    return {
      module: AggregatorModule,
      imports: [HttpModule],
      controllers: [AggregatorController],
      providers: [
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: environment,
        },
        ApiService,
      ],
    };
  }
}
