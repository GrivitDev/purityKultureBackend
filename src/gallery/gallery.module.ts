// src/gallery/gallery.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryMedia, GalleryMediaSchema } from './schemas/gallery.schema';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GalleryMedia.name, schema: GalleryMediaSchema },
    ]),
    UploadModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
