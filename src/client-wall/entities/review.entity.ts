import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop()
  name?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  style: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
      },
    ],
    required: true,
  })
  media: { url: string; public_id: string; type: 'image' | 'video' }[];

  @Prop({ default: 0 })
  likes: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
