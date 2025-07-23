export interface NotificationPayload {
  message?: string;
  templateName?: string;
  phones: string[];
  messageType: 'text' | 'template';
  parameters?: Array<{ type: string; text: string }>;
}
