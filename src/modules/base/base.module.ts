import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './entities/base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Base])],
  providers: [BaseService],
  controllers: [BaseController],
  exports:[BaseService]
})
export class BaseModule { }
