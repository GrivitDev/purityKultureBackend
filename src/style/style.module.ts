import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StyleController } from './style.controller';
import { StyleService } from './style.service';
import { Style, StyleSchema } from './schemas/style.schema';
import { UploadModule } from '../upload/upload.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Style.name, schema: StyleSchema }]),
    UploadModule,
    CategoryModule, // For optional population, if needed
  ],
  controllers: [StyleController],
  providers: [StyleService],
  exports: [StyleService],
})
export class StyleModule {}
