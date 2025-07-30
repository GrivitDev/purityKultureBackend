import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, FilterQuery } from 'mongoose';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UploadService } from '../upload/upload.service';

interface ReviewFilter {
  page: number;
  limit: number;
  style?: string;
  rating?: number;
}

@Injectable()
export class ClientReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private uploadService: UploadService,
  ) {}

  async createReview(
    dto: CreateReviewDto,
    files: Express.Multer.File[],
  ): Promise<Review> {
    const validMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    for (const file of files) {
      if (!validMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Unsupported file type: ${file.originalname}`,
        );
      }
    }

    const media = await this.uploadService.uploadMultiple(
      files,
      'client-reviews',
    );
    const payload = { ...dto, media };
    return this.reviewModel.create(payload);
  }

  async getReviews(
    filter: ReviewFilter,
  ): Promise<{ reviews: Review[]; total: number; page: number }> {
    const { page, limit, style, rating } = filter;

    const query: FilterQuery<Review> = {};
    if (style) query.style = { $regex: style, $options: 'i' };
    if (rating !== undefined) query.rating = rating;

    const total = await this.reviewModel.countDocuments(query);
    const reviews = await this.reviewModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { reviews, total, page };
  }

  async getAllAdminReviews(): Promise<Review[]> {
    return this.reviewModel.find().sort({ createdAt: -1 });
  }

  async likeReview(id: string): Promise<{ likes: number }> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid review ID');
    const updated = await this.reviewModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    );
    if (!updated)
      throw new BadRequestException('Review not found or could not be liked');
    return { likes: updated.likes };
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid review ID');
    const found = await this.reviewModel.findById(id);
    if (!found) throw new BadRequestException('Review not found');

    await found.deleteOne();
    return { deleted: true };
  }
}
