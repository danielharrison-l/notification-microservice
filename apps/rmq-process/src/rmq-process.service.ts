import { Injectable, Logger } from '@nestjs/common';
import { NotificationPayload } from './interfaces/notification.interface';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { WhatsappService } from './whatsapp/whatsapp.service';

interface ProcessResult {
  phoneNumber: string;
  messageId: string;
  status: 'success';
}

interface ProcessError {
  phoneNumber: string;
  error: string;
  status: 'failed';
}

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

      if (!data.phones || data.phones.length === 0) {
        throw new Error('No phone numbers provided');
      }

      if (data.messageType !== 'template') {
        throw new Error('Only template messages are currently supported');
      }

      if (!data.templateName) {
        throw new Error('Template name is required for template messages');
      }

      const results: ProcessResult[] = [];
      const errors: ProcessError[] = [];

      const promises = data.phones.map((phoneNumber) =>
        this.whatsappService
          .sendTemplateMessage(phoneNumber, data.templateName!, data.parameters)
          .then((whatsappResponse) => ({
            phoneNumber,
            messageId: whatsappResponse.messages?.[0]?.id || 'unknown',
            status: 'success',
          }))
          .catch((error) => ({
            phoneNumber,
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 'failed',
          })),
      );

      const settledResults = await Promise.all(promises);

      settledResults.forEach((result) => {
        if (result.status === 'success') results.push(result as ProcessResult);
        else errors.push(result as ProcessError);
      });

      this.logger.log(
        `Notification processing completed. Success: ${results.length}, Errors: ${errors.length}`,
      );

      if (errors.length > 0) {
        this.logger.warn('Some messages failed to send:', errors);
      }

      channel.ack(originalMessage);

      return JSON.stringify({
        message: 'Notification processing completed',
        totalNumbers: data.phones.length,
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors,
      });
    } catch (error) {
      this.logger.error('Failed to process notification:', error);

      channel.ack(originalMessage);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return JSON.stringify({
        message: 'Failed to process notification',
        error: errorMessage,
        totalNumbers: 0,
        successCount: 0,
        errorCount: 1,
        results: [],
        errors: [
          {
            phoneNumber: 'unknown',
            error: errorMessage,
            status: 'failed',
          },
        ],
      });
    }
  }
}
