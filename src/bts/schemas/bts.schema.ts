// src/bts/schemas/bts.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BTSVideoDocument = BTSVideo & Document;

@Schema({ timestamps: true })
export class BTSVideo {
  @Prop({ required: true })
  videoUrl: string;

  @Prop()
  cloudinaryId: string;

  @Prop({ required: true })
  caption: string; // Title of the BTS video

  @Prop({ required: true })
  description: string; // Story/Explanation

  @Prop({
    type: Object,
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

export const BTSVideoSchema = SchemaFactory.createForClass(BTSVideo);
