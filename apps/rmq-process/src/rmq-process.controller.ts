import { Controller, Get } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @Get()
  getHello(): string {
    return this.rmqProcessService.getHello();
  }
}
