import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Base } from './entities/base.entity';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { BaseCreateDTO } from './dto/base-create.dto';
import { BaseEditDTO } from './dto/base-edit.dto';
import { getPagination } from 'src/utils';

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(Base)
    private readonly baseRepository: Repository<Base>,
  ) {
  }

  // 获取列表
  async getMore(listDTO: ListDTO) {
    const { page = 1, pageSize = 10, name, sex, telephone, apartment, title, status } = listDTO;

    const querybuilder = this.baseRepository
      .createQueryBuilder('base')
      .where({ isDelete: false });

    //  筛选
    name && querybuilder.andWhere(`base.name LIKE '%${name}%'`)
    sex && querybuilder.andWhere('base.sex = :sex', { sex })
    telephone && querybuilder.andWhere(`base.telephone LIKE '%${telephone}%'`)
    apartment && querybuilder.andWhere('base.apartment = :apartment', { apartment });
    title && querybuilder.andWhere('base.title = :title', { title });
    status && querybuilder.andWhere('base.status = :status', { status });

    // 分页
    const getList = querybuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy("base.id", 'DESC')
      .getManyAndCount();

    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page)

    return {
      list,
      pagination,
    }
  }

  // 获取单条
  async getOne(idDTO: IdDTO) {
    const baseDetail = await this.baseRepository
      .createQueryBuilder('base')
      .where('base.id= :id', idDTO)
      .getOne();

    if (!baseDetail) {
      throw new NotFoundException('找不到文章')
    }

    return {
      info: baseDetail
    };
  }

  // 创建教师数据
  async create(baseCreateDTO: BaseCreateDTO): Promise<Base> {
    const base = this.baseRepository.create();
    base.name = baseCreateDTO.name;
    base.sex = baseCreateDTO.sex;
    base.birth = baseCreateDTO.birth;
    base.location = baseCreateDTO.location;
    base.telephone = baseCreateDTO.telephone;
    base.introduce = baseCreateDTO.introduce;
    base.graduation = baseCreateDTO.graduation;
    base.education = baseCreateDTO.education;
    base.apartment = baseCreateDTO.apartment;
    base.title = baseCreateDTO.title;
    base.status = baseCreateDTO.status;
    return await this.baseRepository.save(base);
  }

  async edit(idDTO: IdDTO, baseEditDTO: BaseEditDTO): Promise<Base> {
    let baseToEdit = await this.baseRepository.findOne(idDTO);
    baseToEdit.name = baseEditDTO.name;
    baseToEdit.sex = baseEditDTO.sex;
    baseToEdit.birth = baseEditDTO.birth;
    baseToEdit.location = baseEditDTO.location;
    baseToEdit.telephone = baseEditDTO.telephone;
    baseToEdit.introduce = baseEditDTO.introduce;
    baseToEdit.graduation = baseEditDTO.graduation;
    baseToEdit.education = baseEditDTO.education;
    baseToEdit.apartment = baseEditDTO.apartment;
    baseToEdit.title = baseEditDTO.title;
    baseToEdit.status = baseEditDTO.status;

    const result = await this.baseRepository.save(baseToEdit);
    return result;
  }

  async delete(idDTO: IdDTO) {
    let baseToUpdate = await this.baseRepository.findOne(idDTO);
    baseToUpdate.isDelete = true
    const result = await this.baseRepository.save(baseToUpdate)
    return result
  }

  async deleteMore(idDTOS: IdDTO[]) {
    let bases = await this.baseRepository.findByIds([...new Set(idDTOS)]);
    bases.map((base) => base.isDelete = true);
    const result = await this.baseRepository.save(bases);
    return result
  }
}
