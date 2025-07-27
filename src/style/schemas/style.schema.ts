import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

export type StyleDocument = Style & Document;

@Schema({ timestamps: true })
export class Style {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  priceMin: number;

  @Prop({ required: true })
  priceMax: number;

  @Prop({ type: MSchema.Types.ObjectId, ref: 'Category', required: true })
  category: MSchema.Types.ObjectId;

  @Prop()
  imageUrl: string;

  @Prop()
  cloudinaryId: string;

  @Prop({ default: 0 })
  wow: number;

  @Prop({ default: 0 })
  fire: number;

  @Prop({ default: 0 })
  gem: number;

  @Prop({ default: 0 })
  dislike: number;
}

export const StyleSchema = SchemaFactory.createForClass(Style);
