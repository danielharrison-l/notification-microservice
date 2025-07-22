import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env.schema';
import { WhatsAppError } from './interfaces/whatsapp-error.interface';

import { WhatsAppTextMessage } from 'apps/rmq-process/src/whatsapp/interfaces/whatsapp-text-message.interface';
import { WhatsAppTemplateMessage } from 'apps/rmq-process/src/whatsapp/interfaces/whatsapp-template-message.interface';
import { WhatsAppResponse } from 'apps/rmq-process/src/whatsapp/interfaces/whatsapp-response.interface';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private lastMessageTime: number = 0;
  private readonly MESSAGE_DELAY_MS = 2000;

  constructor() {
    this.baseUrl = `${env.WHATSAPP_API_URL}${env.WHATSAPP_API_VERSION}`;
    this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  }

  async sendTextMessage(
    to: string,
    message: string,
  ): Promise<WhatsAppResponse> {
    const payload: WhatsAppTextMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    return this.sendMessage(payload);
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = 'pt_BR',
    parameters?: Array<{ type: string; text: string }>,
  ): Promise<WhatsAppResponse> {
    const payload: WhatsAppTemplateMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
      },
    };

    if (parameters && parameters.length > 0) {
      payload.template.components = [
        {
          type: 'body',
          parameters,
        },
      ];
    }

    return this.sendMessage(payload);
  }

  private async sendMessage(
    payload: WhatsAppTextMessage | WhatsAppTemplateMessage,
  ): Promise<WhatsAppResponse> {
    await this.enforceRateLimit();

    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

    try {
      this.logger.log(`Sending WhatsApp message to: ${payload.to}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as WhatsAppResponse | WhatsAppError;

      if (!response.ok) {
        const error = data as WhatsAppError;
        this.logger.error(`WhatsApp API Error: ${error.error.message}`, error);
        throw new Error(`WhatsApp API Error: ${error.error.message}`);
      }

      const successData = data as WhatsAppResponse;
      this.logger.log(
        `WhatsApp message sent successfully. Message ID: ${successData.messages[0]?.id}`,
      );
      return successData;
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message', error);
      throw error;
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\D/g, '');

    if (!formatted.startsWith('55') && formatted.length === 11) {
      formatted = '55' + formatted;
    }

    return formatted;
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    return /^55\d{10,11}$/.test(formatted);
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastMessage = now - this.lastMessageTime;

    if (timeSinceLastMessage < this.MESSAGE_DELAY_MS) {
      const waitTime = this.MESSAGE_DELAY_MS - timeSinceLastMessage;
      this.logger.log(
        `Rate limiting: waiting ${waitTime}ms before sending message`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastMessageTime = Date.now();
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    return this.validatePhoneNumber(phoneNumber);
  }
}
