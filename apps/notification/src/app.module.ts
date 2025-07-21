import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

export const NOTIFICATION_SERVICE_RABBITMQ = 'NOTIFICATION_SERVICE_RABBITMQ';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
