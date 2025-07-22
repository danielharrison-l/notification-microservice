import { Injectable } from '@nestjs/common';
import { NotificationPayload } from './interfaces/notification.interface';

@Injectable()
export class RmqProcessService {
  getHello(): string {
    return 'Hello World!';
  }

  processNotification(data: NotificationPayload): string {
    console.log('Processing notification:', data);
    // Here you can add your business logic to process the notification
    return `Notification processed: ${data.message}`;
  }
}
