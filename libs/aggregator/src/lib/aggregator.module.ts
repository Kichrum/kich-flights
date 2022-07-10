import { HttpModule } from '@nestjs/axios';
import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { AggregatorController } from './controllers/aggregator.controller';
import { ENVIRONMENT_TOKEN } from './constants/environment-token.constant';
import { Environment } from './models/environment.model';
import { ApiService } from './services/api/api.service';
import { AggregatorService } from './services/aggregator/aggregator.service';

@Module({})
export class AggregatorModule {
  static register(environment: Environment): DynamicModule {
    const sourcesCacheConfig = !environment.redisToken
      ? {} // Use default in-memory cache if no Redis token provided
      : {
          store: redisStore,
          host: environment.redisHost,
          port: environment.redisPort,
          auth_pass: environment.redisToken,
        };
    return {
      module: AggregatorModule,
      imports: [
        HttpModule,
        CacheModule.register({
          ttl: environment.cacheTime,
          ...sourcesCacheConfig,
        }),
      ],
      controllers: [AggregatorController],
      providers: [
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: environment,
        },
        AggregatorService,
        ApiService,
      ],
    };
  }
}
