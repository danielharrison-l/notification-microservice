export interface NotificationPayload {
  message: string;
  phoneNumber?: string;
  templateName?: string;
  messageType?: 'text' | 'template';
}
