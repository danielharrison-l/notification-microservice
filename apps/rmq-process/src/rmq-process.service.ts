import { Injectable } from '@nestjs/common';

@Injectable()
export class RmqProcessService {
  getHello(): string {
    return 'Hello World!';
  }
}
