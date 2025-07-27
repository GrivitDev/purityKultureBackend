// src/gallery/gallery.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Upload multiple media
  @Post()
  @UseInterceptors(
    FilesInterceptor('media', 10, {
      storage: multer.memoryStorage(),
    }),
  )
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.galleryService.uploadMedia(files, 'admin');
  }

  // Get all media
  @Get()
  async findAll() {
    return this.galleryService.findAll();
  }

  // Delete a media item
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }

  // Replace media file
  @Patch(':id/replace-media')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: multer.memoryStorage(),
    }),
  )
  async replace(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleryService.replaceMedia(id, file);
  }

  // React to media
  @Patch(':id/react/:emoji')
  async reactToMedia(@Param('id') id: string, @Param('emoji') emoji: string) {
    return this.galleryService.reactToMedia(id, emoji);
  }
}
