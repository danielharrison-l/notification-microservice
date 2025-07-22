import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

export const NOTIFICATION_SERVICE_RABBITMQ = 'NOTIFICATION_SERVICE_RABBITMQ';

@Module({
  imports: [RabbitmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
