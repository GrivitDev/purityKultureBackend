import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body()
    body: {
      fullName: string;
      address: string;
      phoneNumber: string;
      source: 'collection' | 'gallery' | 'client-review';
      styleTitle: string;
      mediaUrl?: string;
      mediaType?: 'image' | 'video';
    },
  ) {
    return this.orderService.createOrder(body);
  }

  @Get()
  getAll() {
    return this.orderService.getAllOrders();
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.orderService.approveOrder(id);
  }
}
