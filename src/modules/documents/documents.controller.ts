import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentsDto } from './dto/create-documents.dto';
import { ListDto } from './dto/list.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('picUrl'))
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '创建公文' })
  async create(@UploadedFiles() picUrl: Array<Express.Multer.File>,@Body() createDocumentsDto: CreateDocumentsDto) {
    console.log(createDocumentsDto,picUrl);
    return await this.documentsService.create(picUrl,createDocumentsDto);
  }

  @Get()
  @ApiOperation({ summary: '查询公文' })
  async findAll(@Query() listDto: ListDto) {
    return await this.documentsService.findAll(listDto);
  }

  @Get(':id')
  @ApiOperation({summary:'查询某个公文'})
  async findOne(@Param('id') id: number){
    return await this.documentsService.findDocument(id); 
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('picUrl'))
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '编辑公文' })
  async update(@UploadedFiles() picUrl: Array<Express.Multer.File>,@Body() updateDocumentsDto: UpdateDocumentsDto) {
    return await this.documentsService.update(picUrl,updateDocumentsDto);
  }


  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '删除公文' })
  async remove(@Param('id') id: number) {
    return await this.documentsService.remove(+id);
  }
}
