// src/bts/bts.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BTSVideo, BTSVideoSchema } from './schemas/bts.schema';
import { BtsController } from './bts.controller';
import { BtsService } from './bts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BTSVideo.name, schema: BTSVideoSchema },
    ]),
  ],
  controllers: [BtsController],
  providers: [BtsService],
})
export class BtsModule {}
