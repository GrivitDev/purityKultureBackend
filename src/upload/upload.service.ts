import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<
    {
      url: string;
      public_id: string;
      type: 'image' | 'video';
    }[]
  > {
    return await Promise.all(
      files.map(
        (file) =>
          new Promise<{
            url: string;
            public_id: string;
            type: 'image' | 'video';
          }>((resolve, reject) => {
            const type = file.mimetype.startsWith('video') ? 'video' : 'image';

            const stream = cloudinary.uploader.upload_stream(
              {
                folder,
                resource_type: type,
              },
              (
                error: Error | undefined,
                result: UploadApiResponse | undefined,
              ) => {
                if (error || !result) {
                  return reject(new Error(error?.message || 'Upload failed'));
                }

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                  type,
                });
              },
            );

            void stream.end(file.buffer); // ✅ fixed floating promise
          }),
      ),
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; public_id: string; type: string }> {
    const type = file.mimetype.startsWith('video') ? 'video' : 'image';

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: type,
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(new Error(error?.message || 'Upload failed'));
          }

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            type,
          });
        },
      );

      void stream.end(file.buffer); // ✅ fixed floating promise
    });
  }

  async delete(publicId: string, type: 'image' | 'video'): Promise<void> {
    return new Promise((resolve, reject) => {
      void cloudinary.uploader.destroy(
        publicId,
        { resource_type: type },
        (error: Error | undefined) => {
          if (error) return reject(new Error(error.message));
          resolve();
        },
      );
    });
  }
}
