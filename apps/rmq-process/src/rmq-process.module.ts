import { Module } from '@nestjs/common';
import { RmqProcessController } from './rmq-process.controller';
import { RmqProcessService } from './rmq-process.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Module({
  imports: [],
  controllers: [RmqProcessController],
  providers: [RmqProcessService, WhatsappService],
})
export class RmqProcessModule {}
