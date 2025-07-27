import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientReviewController } from './client-review.controller';
import { ClientReviewService } from './client-review.service';
import { Review, ReviewSchema } from './entities/review.entity';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ClientReviewController],
  providers: [ClientReviewService, UploadService],
})
export class ClientReviewModule {}
