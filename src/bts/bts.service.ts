// src/bts/bts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BTSVideo, BTSVideoDocument } from './schemas/bts.schema';
import { Model } from 'mongoose';
import cloudinary from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BtsService {
  constructor(
    @InjectModel(BTSVideo.name) private model: Model<BTSVideoDocument>,
  ) {}

  async create(
    data: { caption: string; description: string },
    file: Express.Multer.File,
  ) {
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: 'purity_kulture/bts',
      resource_type: 'video',
      public_id: uuidv4(),
    });

    return this.model.create({
      caption: data.caption,
      description: data.description,
      videoUrl: upload.secure_url,
      cloudinaryId: upload.public_id,
    });
  }

  async findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  async update(id: string, data: { caption?: string; description?: string }) {
    const video = await this.model.findById(id);
    if (!video) throw new NotFoundException('BTS video not found');
    Object.assign(video, data);
    return video.save();
  }

  async delete(id: string) {
    const video = await this.model.findById(id);
    if (!video) throw new NotFoundException('BTS video not found');

    if (video.cloudinaryId) {
      await cloudinary.uploader.destroy(video.cloudinaryId, {
        resource_type: 'video',
      });
    }

    return this.model.deleteOne({ _id: id });
  }

  async replaceVideo(id: string, file: Express.Multer.File) {
    const video = await this.model.findById(id);
    if (!video) throw new NotFoundException('BTS video not found');

    if (video.cloudinaryId) {
      await cloudinary.uploader.destroy(video.cloudinaryId, {
        resource_type: 'video',
      });
    }

    const upload = await cloudinary.uploader.upload(file.path, {
      folder: 'purity_kulture/bts',
      resource_type: 'video',
      public_id: uuidv4(),
    });

    video.videoUrl = upload.secure_url;
    video.cloudinaryId = upload.public_id;
    return video.save();
  }

  async react(id: string, emoji: string) {
    const video = await this.model.findById(id);
    if (!video) throw new NotFoundException('BTS video not found');

    const allowed = ['smile', 'thumbsUp', 'heart', 'wow', 'sad'];
    if (!allowed.includes(emoji)) {
      throw new Error('Invalid emoji type');
    }

    video.reactions[emoji] = (video.reactions[emoji] || 0) + 1;
    return video.save();
  }
}
