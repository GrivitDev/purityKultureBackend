import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly groupChatId = process.env.TELEGRAM_ORDER_GROUP_ID;

  async sendToOrderGroup(message: string): Promise<void> {
    if (!this.botToken || !this.groupChatId) {
      this.logger.warn('Telegram bot token or group chat ID is missing.');
      this.logger.warn(`botToken: ${this.botToken}`);
      this.logger.warn(`groupChatId: ${this.groupChatId}`);
      return;
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    this.logger.log(`Telegram URL: ${url}`);
    this.logger.log(`Sending to chat ID: ${this.groupChatId}`);
    this.logger.log(`Message: ${message}`);

    try {
      const response = await axios.post(url, {
        chat_id: this.groupChatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      });

      this.logger.log('Telegram message sent successfully');
      this.logger.debug(
        `Telegram API response: ${JSON.stringify(response.data)}`,
      );
    } catch (error: unknown) {
      this.logger.error('Failed to send Telegram message');

      if (axios.isAxiosError(error)) {
        this.logger.error(`Axios error message: ${error.message}`);

        if (error.response) {
          this.logger.error(`Response status: ${error.response.status}`);
          this.logger.error(
            `Response data: ${JSON.stringify(error.response.data)}`,
          );
        }
      } else if (error instanceof Error) {
        this.logger.error(`Unknown error: ${error.message}`);
      } else {
        this.logger.error(`Unknown non-error thrown: ${JSON.stringify(error)}`);
      }
    }
  }
}
