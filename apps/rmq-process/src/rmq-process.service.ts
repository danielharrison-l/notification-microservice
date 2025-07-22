import { Injectable } from '@nestjs/common';
import { NotificationPayload } from './interfaces/notification.interface';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Injectable()
export class RmqProcessService {
  processNotification(data: NotificationPayload, context: RmqContext): string {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message;

    channel.ack(originalMessage);

    console.log('Processing notification:', data);
    const message = context.getMessage() as Message;
    return `Notification processed: ${data.message}, Context: ${message.content.toString()}`;
  }
}
