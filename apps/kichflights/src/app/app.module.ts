import { AggregatorModule } from '@kichflights/aggregator';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';

@Module({
  imports: [AggregatorModule.register(environment)],
  controllers: [AppController],
})
export class AppModule {}
