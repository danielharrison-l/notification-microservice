import { Module } from '@nestjs/common';
import { RmqProcessController } from './rmq-process.controller';
import { RmqProcessService } from './rmq-process.service';

@Module({
  imports: [],
  controllers: [RmqProcessController],
  providers: [RmqProcessService],
})
export class RmqProcessModule {}
