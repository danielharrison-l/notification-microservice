import { NestFactory } from '@nestjs/core';
import { RmqProcessModule } from './rmq-process.module';

async function bootstrap() {
  const app = await NestFactory.create(RmqProcessModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
