import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env.schema';
import { WhatsAppError } from './interfaces/whatsapp-error.interface';

import { WhatsAppTemplateMessage } from 'apps/rmq-process/src/whatsapp/interfaces/whatsapp-template-message.interface';
import { WhatsAppResponse } from 'apps/rmq-process/src/whatsapp/interfaces/whatsapp-response.interface';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private lastRequestTime = 0;

  constructor() {
    this.baseUrl = `${env.WHATSAPP_API_URL}${env.WHATSAPP_API_VERSION}`;
    this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    parameters?: Array<{ type: string; text: string }>,
  ): Promise<WhatsAppResponse> {
    const payload: WhatsAppTemplateMessage = {
      messaging_product: 'whatsapp',
      to: this.formatPhoneNumber(to),
      type: 'template',
      recipient_type: 'individual',
      template: {
        name: templateName,
        language: {
          code: 'pt_BR',
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
    payload: WhatsAppTemplateMessage,
  ): Promise<WhatsAppResponse> {
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

  isValidPhoneNumber(phoneNumber: string): boolean {
    return this.validatePhoneNumber(phoneNumber);
  }
}
