import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CategoryService } from './category.service';

@Controller('admin/categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB limit
    }),
  )
  async create(
    @Body('name') name: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.create(name, file);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body('name') name?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.update(id, name, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
