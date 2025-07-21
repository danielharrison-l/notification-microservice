import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('notification')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async defaultNestJS() {
    return this.appService.defaultNestJS();
  }
}
