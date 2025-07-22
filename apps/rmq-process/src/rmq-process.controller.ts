import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqProcessService } from './rmq-process.service';
import { NotificationPayload } from './interfaces/notification.interface';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @Get()
  getHello(): string {
    return this.rmqProcessService.getHello();
  }

  @MessagePattern('notification_rmq')
  handleNotification(@Payload() data: NotificationPayload) {
    console.log('Received message from RabbitMQ:', data);
    return this.rmqProcessService.processNotification(data);
  }
}
