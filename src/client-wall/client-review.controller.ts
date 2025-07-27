// src/client-review/client-review.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateReviewDto } from './dto/create-review.dto';
import { ClientReviewService } from './client-review.service';

@Controller('client-reviews')
export class ClientReviewController {
  constructor(private readonly service: ClientReviewService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('media', 5, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateReviewDto,
  ) {
    return this.service.createReview(dto, files);
  }

  @Get()
  async getAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 12,
    @Query('style') style?: string,
    @Query('rating') rating?: number,
  ) {
    return this.service.getReviews({ page, limit, style, rating });
  }

  @Get('admin')
  async getAllAdmin() {
    return this.service.getAllAdminReviews();
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    return this.service.likeReview(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
