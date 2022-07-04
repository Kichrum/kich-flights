import { AggregatorModule } from '@kichflights/aggregator';
import { Module } from '@nestjs/common';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AggregatorModule.register(environment)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
