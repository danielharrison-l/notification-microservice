import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqProcessService } from './rmq-process.service';
import { NotificationPayload } from './interfaces/notification.interface';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @MessagePattern('notification_rmq')
  handleNotification(
    @Payload() data: NotificationPayload,
    @Ctx() context: RmqContext,
  ) {
    console.log('Received message from RabbitMQ:', data);
    return this.rmqProcessService.processNotification(data, context);
  }
}
