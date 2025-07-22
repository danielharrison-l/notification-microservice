import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqProcessModule } from './rmq-process.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RmqProcessModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'notification_queue',
        noAck: false,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}
void bootstrap();
