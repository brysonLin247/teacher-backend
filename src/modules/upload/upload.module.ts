import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import * as path from 'path';
import { diskStorage } from 'multer';
import { Upload } from './entities/upload.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Research } from '../research/entities/research.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload,Research]),
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(__dirname, '../../upload_dist'),
        filename(req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports:[UploadService]
})
export class UploadModule {}
