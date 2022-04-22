import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from 'src/utils';
import { Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';
import { CreateDocumentsDto } from './dto/create-documents.dto';
import { ListDto } from './dto/list.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { Documents } from './entities/documents.entity';

@Injectable()
export class DocumentsService {
  path = 'documents'
  constructor(
    @InjectRepository(Documents)
    private readonly documentsRepository: Repository<Documents>,
    private readonly uploadService: UploadService
  ) { }

  async create(picUrl: Array<Express.Multer.File>,createDocumentsDto: CreateDocumentsDto) {
    const { title, type, content, author } = createDocumentsDto;
    const newDocument = await this.documentsRepository.create();
    newDocument.title = title;
    newDocument.type = type;
    newDocument.content = content;
    newDocument.author = author;
    newDocument.picUrl = picUrl.length ? await this.uploadService.upLoadImage({
      base64: picUrl[0].buffer,
      path: this.path,
    }) : '';
    await this.documentsRepository.save(newDocument);
    return;
  }

  async findAll(listDto: ListDto) {
    const { page = 1, pageSize = 10, title, type, content } = listDto;
    const querybuilder = this.documentsRepository
      .createQueryBuilder('documents')
      .where({ isDelete: false })

    title && querybuilder.andWhere(`documents.title LIKE '%${title}%'`);
    type && querybuilder.andWhere('documents.type = :type', { type });
    content && querybuilder.andWhere(`documents.content LIKE '%${content}%'`);

    const getList = querybuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy("documents.id", 'DESC')
      .getManyAndCount();
    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page)
    return {
      list,
      pagination,
    }
  }

  async findDocument(id: number) {
    let document = await this.documentsRepository.findOne(id);
    if (!document) throw new NotFoundException('找不到该公文');
    return document;
  }

  async update(picUrl: Array<Express.Multer.File>,updateDocumentsDto: UpdateDocumentsDto) {
    const { id, title, type, content, author } = updateDocumentsDto;
    const documentsToUpdate = await this.documentsRepository
      .createQueryBuilder('documents')
      .where({ isDelete: false })
      .andWhere('documents.id = :id', { id })
      .getOne();
    if (!documentsToUpdate) throw new NotFoundException('找不到该公文');
    documentsToUpdate.title = title;
    documentsToUpdate.type = type;
    documentsToUpdate.author = author;
    documentsToUpdate.content = content;
    documentsToUpdate.picUrl = picUrl.length ? await this.uploadService.updateImage({
      originName: documentsToUpdate.picUrl,
      base64: picUrl[0].buffer,
      path: this.path,
    }) : documentsToUpdate.picUrl;
    await this.documentsRepository.save(documentsToUpdate);
    return;
  }

  async remove(id: number) {
    let documentsToDelete = await this.documentsRepository.findOne(id);
    const { picUrl } = documentsToDelete;
    if (!documentsToDelete) throw new NotFoundException('找不到该公文');
    documentsToDelete.isDelete = true;
    await this.documentsRepository.save(documentsToDelete);
    if (picUrl) {
      let name = picUrl.match(/documents\/(.*)/g)[0];
      await this.uploadService.deleteImage(name);
    }
    return;
  }
}
