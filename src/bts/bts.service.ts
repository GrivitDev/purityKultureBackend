import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BTSVideo, BTSVideoDocument } from './schemas/bts.schema';
import { Model } from 'mongoose';
import cloudinary from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

@Injectable()
export class BtsService {
  constructor(
    @InjectModel(BTSVideo.name) private model: Model<BTSVideoDocument>,
  ) {}

  private async uploadToCloudinary(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'purity_kulture/bts',
          resource_type: 'video',
          public_id: uuidv4(),
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );
      bufferToStream(buffer).pipe(uploadStream);
    });
  }

  async create(
    data: { caption: string; description: string },
    file: Express.Multer.File,
  ) {
    const upload = await this.uploadToCloudinary(file.buffer);
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

    const upload = await this.uploadToCloudinary(file.buffer);
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
