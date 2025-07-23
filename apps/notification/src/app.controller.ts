import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationPayload } from 'apps/rmq-process/src/interfaces/notification.interface';

@Controller('notification')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  sendNotification(@Body() data: NotificationPayload) {
    return this.appService.defaultNestJS(data);
  }
}
