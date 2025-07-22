import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqProcessModule } from './rmq-process.module';
import { env } from 'apps/rmq-process/src/config/env.schema';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RmqProcessModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [env.RABBITMQ_URL],
        queue: env.RABBITMQ_QUEUE,
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
