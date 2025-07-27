// src/gallery/gallery.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GalleryMedia,
  GalleryMediaDocument,
  MediaType,
  MediaSource,
} from './schemas/gallery.schema';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(GalleryMedia.name)
    private galleryModel: Model<GalleryMediaDocument>,
    private uploadService: UploadService,
  ) {}

  // Upload multiple files. Default source is 'admin', but you could pass 'client-review' if needed.
  async uploadMedia(
    files: Express.Multer.File[],
    source: MediaSource = 'admin',
  ) {
    const uploads = await this.uploadService.uploadMultiple(
      files,
      'purity_kulture/gallery',
    );
    // Create gallery entries with the returned upload details.
    const createPromises = uploads.map((upload) => {
      const mediaType: MediaType = upload.type; // 'image' or 'video'
      return this.galleryModel.create({
        mediaUrl: upload.url,
        cloudinaryId: upload.public_id, // assuming the upload result has public_id
        type: mediaType,
        source,
        reactions: { smile: 0, thumbsUp: 0, heart: 0, wow: 0, sad: 0 },
      });
    });
    return await Promise.all(createPromises);
  }

  async findAll() {
    return this.galleryModel.find().sort({ createdAt: -1 }).exec();
  }

  async delete(id: string) {
    const media = await this.galleryModel.findById(id);
    if (!media) throw new NotFoundException('Gallery media not found');

    // Remove from Cloudinary if cloudinaryId exists.
    if (media.cloudinaryId) {
      // Make sure you configure your Cloudinary call similar to other modules.
      await this.uploadService.delete(media.cloudinaryId, media.type);
    }
    return this.galleryModel.deleteOne({ _id: id });
  }

  async replaceMedia(id: string, file: Express.Multer.File) {
    const media = await this.galleryModel.findById(id);
    if (!media) throw new NotFoundException('Gallery media not found');

    // Delete the old media from Cloudinary.
    if (media.cloudinaryId) {
      await this.uploadService.delete(media.cloudinaryId, media.type);
    }

    // Upload the new file.
    const uploadResult = await this.uploadService.uploadFile(
      file,
      'purity_kulture/gallery',
    );
    media.mediaUrl = uploadResult.url;
    media.cloudinaryId = uploadResult.public_id;
    media.type = uploadResult.type as MediaType;
    return media.save();
  }

  // src/gallery/gallery.service.ts
  async reactToMedia(id: string, emoji: string) {
    const media = await this.galleryModel.findById(id);
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Increment the reaction count
    const currentCount = media.reactions?.[emoji] || 0;
    media.reactions[emoji] = currentCount + 1;

    // Save the updated document
    await media.save();

    return {
      message: 'Reaction updated successfully',
      reactions: media.reactions,
    };
  }
}
