import {
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { staticBaseUrl } from './constants';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { GetUploadDto } from './dto/get-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }
  
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传单个科研文件' })
  uploadFile(@Query() createUploadDto: CreateUploadDto, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.create(createUploadDto, file);
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '上传单个或多个科研文件' })
  uploadFiles(@Query() createUploadDto: CreateUploadDto,@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadService.uploadFiles(createUploadDto,files);
  }

  @Get()
  @ApiOperation({ summary: '显示科研文件' })
  async findById(@Query() getUploadDto:GetUploadDto){
    return await this.uploadService.findById(getUploadDto);
  }

  @Patch('files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '重新上传科研文件' })
  editFile(@Query() updateUploadDto: UpdateUploadDto,@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadService.editById(updateUploadDto,files);
  }
}
