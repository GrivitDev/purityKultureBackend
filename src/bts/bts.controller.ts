// src/bts/bts.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BtsService } from './bts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('bts')
export class BtsController {
  constructor(private readonly service: BtsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  create(
    @Body() body: { caption: string; description: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.create(body, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { caption?: string; description?: string },
  ) {
    return this.service.update(id, body);
  }

  @Patch(':id/replace-video')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  replaceVideo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.replaceVideo(id, file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(':id/react/:emoji')
  reactToVideo(@Param('id') id: string, @Param('emoji') emoji: string) {
    return this.service.react(id, emoji);
  }
}
