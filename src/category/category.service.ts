import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<CategoryDocument>,
    private upload: UploadService,
  ) {}

  async findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async create(name: string, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    let cloudinaryId: string | null = null;
    if (file) {
      const upload = await this.upload.uploadFile(
        file,
        'purity_kulture/categories',
      );
      imageUrl = upload.url;
      cloudinaryId = upload.public_id;
    }
    return this.model.create({ name, imageUrl, cloudinaryId });
  }

  async update(id: string, name?: string, file?: Express.Multer.File) {
    const cat = await this.model.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    if (name) cat.name = name;
    if (file) {
      if (cat.cloudinaryId) await this.upload.delete(cat.cloudinaryId, 'image');
      const upload = await this.upload.uploadFile(
        file,
        'purity_kulture/categories',
      );
      cat.imageUrl = upload.url;
      cat.cloudinaryId = upload.public_id;
    }
    return cat.save();
  }

  async delete(id: string) {
    const cat = await this.model.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    if (cat.cloudinaryId) await this.upload.delete(cat.cloudinaryId, 'image');
    return this.model.deleteOne({ _id: id });
  }
}
