import {Controller, Get, Inject} from '@nestjs/common';
import { ENVIRONMENT_TOKEN } from './constants/environment-token.constant';
import { Environment } from './models';

@Controller('aggregator')
export class AggregatorController {
  constructor(
    @Inject(ENVIRONMENT_TOKEN) private readonly environment: Environment
  ) {}

  @Get()
  getData() {
    return this.environment.sources;
  }
}
