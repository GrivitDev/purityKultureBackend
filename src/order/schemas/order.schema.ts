import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderSource = 'collection' | 'gallery' | 'client-review';
export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, enum: ['collection', 'gallery', 'client-review'] })
  source: OrderSource;

  @Prop({ required: true })
  styleTitle: string;

  @Prop()
  mediaUrl?: string;

  @Prop()
  mediaType?: 'image' | 'video';

  @Prop({ default: false })
  approved: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
