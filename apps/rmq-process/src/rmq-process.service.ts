import { Injectable, Logger } from '@nestjs/common';
import { NotificationPayload } from './interfaces/notification.interface';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Injectable()
export class RmqProcessService {
  private readonly logger = new Logger(RmqProcessService.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  async processNotification(
    data: NotificationPayload,
    context: RmqContext,
  ): Promise<string> {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message;

    try {
      this.logger.log('Processing notification:', data);

      const phoneNumber = data.phoneNumber || '5591981415677';
      const messageType = data.messageType || 'text';

      let whatsappResponse;

      if (messageType === 'template' && data.templateName) {
        whatsappResponse = await this.whatsappService.sendTemplateMessage(
          phoneNumber,
          data.templateName,
          'pt_BR',
        );
      } else {
        whatsappResponse = await this.whatsappService.sendTextMessage(
          phoneNumber,
          data.message,
        );
      }

      this.logger.log('WhatsApp message sent successfully:', whatsappResponse);

      channel.ack(originalMessage);

      const messageId =
        (whatsappResponse.messages?.[0]?.id as string) || 'unknown';
      return `Notification processed and sent to WhatsApp. Message ID: ${messageId}`;
    } catch (error) {
      this.logger.error('Failed to process notification:', error);

      channel.nack(originalMessage, false, true);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send WhatsApp message: ${errorMessage}`);
    }
  }
}
