import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Style, StyleDocument } from './schemas/style.schema';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class StyleService {
  constructor(
    @InjectModel(Style.name) private model: Model<StyleDocument>,
    private upload: UploadService,
  ) {}

  async findAll() {
    return this.model
      .find()
      .populate('category')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(
    data: { title; description; priceMin; priceMax; category },
    file: Express.Multer.File,
  ) {
    const upload = await this.upload.uploadFile(file, 'purity_kulture/styles');
    return this.model.create({
      ...data,
      imageUrl: upload.url,
      cloudinaryId: upload.public_id,
    });
  }

  async update(
    id: string,
    data: Partial<{ title; description; priceMin; priceMax }>,
  ) {
    const style = await this.model.findById(id);
    if (!style) throw new NotFoundException('Style not found');
    Object.assign(style, data);
    return style.save();
  }

  async replaceImage(id: string, file: Express.Multer.File) {
    const style = await this.model.findById(id);
    if (!style) throw new NotFoundException('Style not found');
    if (style.cloudinaryId)
      await this.upload.delete(style.cloudinaryId, 'image');
    const upload = await this.upload.uploadFile(file, 'purity_kulture/styles');
    style.imageUrl = upload.url;
    style.cloudinaryId = upload.public_id;
    return style.save();
  }

  async delete(id: string) {
    const style = await this.model.findById(id);
    if (!style) throw new NotFoundException('Style not found');
    if (style.cloudinaryId)
      await this.upload.delete(style.cloudinaryId, 'image');
    return this.model.deleteOne({ _id: id });
  }

  async react(id: string, reaction: 'wow' | 'fire' | 'gem' | 'dislike') {
    const style = await this.model.findById(id);
    if (!style) throw new NotFoundException('Style not found');

    if (!['wow', 'fire', 'gem', 'dislike'].includes(reaction)) {
      throw new Error('Invalid reaction type');
    }

    style[reaction]++;
    await style.save();
    return { [reaction]: style[reaction] };
  }
}
