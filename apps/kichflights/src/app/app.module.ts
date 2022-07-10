import { AggregatorModule } from '@kichflights/aggregator';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';

@Module({
  imports: [AggregatorModule.register(environment)],
})
export class AppModule {}
