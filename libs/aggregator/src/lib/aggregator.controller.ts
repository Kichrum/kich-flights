import { Controller, Get } from '@nestjs/common';
import { ApiService } from './services/api/api.service';

@Controller('aggregator')
export class AggregatorController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  getData() {
    return this.apiService.fetchFlights();
  }
}
