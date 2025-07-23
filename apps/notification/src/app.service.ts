import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'apps/notification/src/rabbitmq/rabbitmq.service';
import { NotificationPayload } from 'apps/rmq-process/src/interfaces/notification.interface';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  defaultNestJS(data: NotificationPayload) {
    this.rabbitmqService.instance.emit('notification_rmq', data);

    return { message: 'Message sent to RabbitMQ successfully!' };
  }
}
