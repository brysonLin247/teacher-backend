import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from 'src/utils';
import { Repository } from 'typeorm';
import { Base } from '../base/entities/base.entity';
import { Upload } from '../upload/entities/upload.entity';
import { CreateResearchDto } from './dto/create-research.dto';
import { ListDto } from './dto/list.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { Research } from './entities/research.entity';

@Injectable()
export class ResearchService {
  constructor(
    @InjectRepository(Research)
    private readonly researchRepository: Repository<Research>,
    @InjectRepository(Base)
    private readonly baseRepository: Repository<Base>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) { }

  async create(tearcherId: number, createResearchDto: CreateResearchDto) {
    const teacher = await this.baseRepository.findOne(tearcherId);
    const { researchName, field, category, cost, description } = createResearchDto;
    const newResearch = this.researchRepository.create();
    newResearch.researchName = researchName;
    newResearch.field = field;
    newResearch.category = category;
    newResearch.cost = cost;
    newResearch.description = description;
    newResearch.base = teacher;
    newResearch.reviewer = '';
    newResearch.review = 0;
    return await this.researchRepository.save(newResearch);
  }
  async findAll(user: any, listDto: ListDto) {
    const { page = 1, pageSize = 10, researchName, field, category, review,reviewer } = listDto;
    const { id, is_admin } = user;
    const querybuilder = this.researchRepository
      .createQueryBuilder('research')
      // .leftJoinAndSelect('research.base','base')
      .where({ isDelete: false })

    // 查询
    researchName && querybuilder.andWhere(`research.researchName LIKE '%${researchName}%'`);
    field && querybuilder.andWhere('research.field = :field', { field });
    category && querybuilder.andWhere('research.category = :category', { category });
    review && querybuilder.andWhere('research.review = :review', { review });
    reviewer && querybuilder.andWhere(`research.reviewer LIKE '%${reviewer}%'`);

    is_admin === 0 && querybuilder.andWhere('research.baseId = :id', { id });

    // 分页
    const getList = querybuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy("research.researchId", 'DESC')
      .getManyAndCount();


    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page)

    let result = await Promise.all(list.map(async (research) => {
      let base = await this.baseRepository.findOne(research.baseId);
      let files = await this.uploadRepository.createQueryBuilder('upload')
        .where('upload.foreignId = :id', { id: research.researchId })
        .andWhere('upload.type = :type', { type: 1 })
        .getMany();
      research.tearcherName = base.name;
      research.files = files;
      return research;
    }))

    return {
      list: result,
      pagination,
    }
  }

  async update(user: any, id: number, updateResearchDto: UpdateResearchDto) {
    const { researchName, field, category, cost, description, review, reviewer } = updateResearchDto;
    let researchToUpdate = await this.researchRepository
      .createQueryBuilder('research')
      .where({ isDelete: false })
      .andWhere('research.researchId = :id', { id })
      .getOne();
    if (!researchToUpdate) return;
    researchToUpdate.researchName = researchName;
    researchToUpdate.field = field;
    researchToUpdate.category = category;
    researchToUpdate.cost = cost;
    researchToUpdate.description = description;
    researchToUpdate.review = user.is_admin ? review : 0;
    researchToUpdate.reviewer = user.is_admin ? reviewer : '';
    await this.researchRepository.save(researchToUpdate);
    return;
  }

  async remove(id: number) {
    let researchToDelete = await this.researchRepository.findOne(id);
    if (!researchToDelete || researchToDelete.review) return;
    researchToDelete.isDelete = true;
    await this.researchRepository.save(researchToDelete);
    return;
  }
}
