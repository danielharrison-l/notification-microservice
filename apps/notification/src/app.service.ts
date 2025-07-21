import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  defaultNestJS(): string {
    return 'Hello World!';
  }
}
