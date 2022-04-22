import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './entities/documents.entity';
import { BaseModule } from '../base/base.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports:[TypeOrmModule.forFeature([Documents]),BaseModule,UploadModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports:[DocumentsService]
})
export class DocumentsModule {}
