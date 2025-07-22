import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'apps/notification/src/rabbitmq/rabbitmq.service';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  defaultNestJS() {
    this.rabbitmqService.instance.emit('notification_rmq', {
      message: 'Hello from RabbitMQ!',
    });

    return { message: 'Message sent to RabbitMQ successfully!' };
  }
}
