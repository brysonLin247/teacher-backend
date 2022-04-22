import { Module } from '@nestjs/common';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Research } from './entities/research.entity';
import { Base } from '../base/entities/base.entity';
import { BaseModule } from '../base/base.module';
import { Upload } from '../upload/entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Research,Base,Upload]),BaseModule],
  controllers: [ResearchController],
  providers: [ResearchService]
})
export class ResearchModule {}
