// src/gallery/schemas/gallery.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaType = 'image' | 'video';
export type MediaSource = 'admin' | 'client-review';

export type GalleryMediaDocument = GalleryMedia & Document;

@Schema({ timestamps: true })
export class GalleryMedia {
  @Prop({ required: true })
  mediaUrl: string;

  @Prop()
  cloudinaryId: string;

  @Prop({ required: true, enum: ['image', 'video'] })
  type: MediaType;

  @Prop({ default: 'admin', enum: ['admin', 'client-review'] })
  source: MediaSource;

  @Prop({
    type: Map,
    of: Number,
    default: {
      smile: 0,
      thumbsUp: 0,
      heart: 0,
      wow: 0,
      sad: 0,
    },
  })
  reactions: Record<string, number>;
}

export const GalleryMediaSchema = SchemaFactory.createForClass(GalleryMedia);
