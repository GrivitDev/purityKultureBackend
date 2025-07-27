import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryModule } from './category/category.module';
import { ClientReviewModule } from './client-wall/client-review.module';
import { StyleModule } from './style/style.module';
import { UploadModule } from './upload/upload.module';
import { OrderModule } from './order/order.module';
import { TelegramModule } from './notification/telegram.module';
import { GalleryModule } from './gallery/gallery.module';
import { BtsModule } from './bts/bts.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', { infer: true }),
      }),
    }),
    CategoryModule,
    ClientReviewModule,
    StyleModule,
    UploadModule,
    OrderModule,
    TelegramModule,
    GalleryModule,
    BtsModule,
    AdminModule,
  ],
})
export class AppModule {}
