import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TelegramModule } from '../notification/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    TelegramModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
