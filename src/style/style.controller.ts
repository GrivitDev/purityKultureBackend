import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StyleService } from './style.service';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { ReactionType } from './dto/reaction-type.enum';

@Controller('admin/styles')
export class StyleController {
  constructor(private svc: StyleService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() body: CreateStyleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.svc.create(body, image);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateStyleDto) {
    return this.svc.update(id, body);
  }

  @Patch(':id/replace-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  replace(@Param('id') id: string, @UploadedFile() image: Express.Multer.File) {
    return this.svc.replaceImage(id, image);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.svc.delete(id);
  }

  @Patch(':id/react')
  react(@Param('id') id: string, @Body('reaction') reaction: ReactionType) {
    return this.svc.react(id, reaction);
  }
}
