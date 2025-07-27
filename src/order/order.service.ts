import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { TelegramService } from '../notification/telegram.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private telegram: TelegramService,
  ) {}

  // Escape function for MarkdownV2
  private escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, (match) => '\\' + match);
  }

  private formatTelegramMessage(order: Order): string {
    const fullName = this.escapeMarkdownV2(order.fullName);
    const phone = this.escapeMarkdownV2(order.phoneNumber);
    const address = this.escapeMarkdownV2(order.address);
    const source = this.escapeMarkdownV2(order.source);
    const style = this.escapeMarkdownV2(order.styleTitle);
    const media = order.mediaUrl
      ? `📎 Media: ${this.escapeMarkdownV2(order.mediaUrl)}`
      : '';

    return `🧵 *New Order Initiated*

👤 *Name:* ${fullName}
📞 *Phone:* ${phone}
📍 *Address:* ${address}
📌 *From:* ${source}
👗 *Style:* ${style}
${media}`;
  }

  async createOrder(data: {
    fullName: string;
    address: string;
    phoneNumber: string;
    source: 'collection' | 'gallery' | 'client-review';
    styleTitle: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }) {
    const created = await this.orderModel.create(data);

    const message = this.formatTelegramMessage(created);
    await this.telegram.sendToOrderGroup(message);

    return created;
  }

  async getAllOrders() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async approveOrder(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new Error('Order not found');

    order.approved = true;
    await order.save();

    const message = `
*Hello ${order.fullName}! 👋*

We're so thrilled you've shown interest in _“${order.styleTitle}”_ — such a fabulous choice! 💃✨  
Thank you for choosing *Purity Kulture*. We’re *honored* to serve you! 🙏

*💎 Here's what happens next:*

➡️ *We’d love to create this style for you* — tailored to perfection just for you.  
➡️ *We’d like to know your preferences:*  
• 📅 _Do you have a specific event or date in mind?_  
• 🎨 _Any fabric or color preferences?_  
• ✍️ _Would you like any adjustments to the design?_  

🧵 *Once we understand your expectations, we’ll proceed to finalize your beautiful order.*

💜 At *Purity Kulture*, every client is treated like royalty 👑.  
Your _comfort_, _confidence_, and _complete satisfaction_ are our top priorities.  

Let’s continue this conversation here — *we’re ready to make your dream outfit a reality!* 😊💬
`;

    const waLink = `https://wa.me/${order.phoneNumber.replace(/^0/, '234')}?text=${encodeURIComponent(message)}`;

    return { success: true, waLink };
  }
}
