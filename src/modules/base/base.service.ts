import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Base } from './entities/base.entity';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { BaseCreateDTO } from './dto/base-create.dto';
import { BaseEditDTO } from './dto/base-edit.dto';
import { getPagination } from 'src/utils';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram.util';
import { FindByTelDTO } from './dto/findByTel.dto';

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
    const {name,sex,birth,location,telephone,introduce,graduation,education,apartment,title,status,password = '123'} = baseCreateDTO;
    const hasUser = await this.baseRepository.findOne({telephone});
    if (hasUser){
      throw new NotFoundException('用户已存在！')
    }
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt);
    const newUser = this.baseRepository.create();
    newUser.name = name;
    newUser.sex = sex;
    newUser.birth = birth;
    newUser.location = location;
    newUser.telephone = telephone;
    newUser.introduce = introduce;
    newUser.graduation = graduation;
    newUser.education = education;
    newUser.apartment = apartment;
    newUser.title = title;
    newUser.status = status;
    newUser.password = hashPassword;
    newUser.salt = salt;
    newUser.is_admin = 0;
    return await this.baseRepository.save(newUser);
  }

  async findByMobile(findByTelDTO: FindByTelDTO) {
    const user = await this.baseRepository
      .createQueryBuilder('base')
      .addSelect('base.salt')
      .addSelect('base.password')
      .where('base.telephone = :telephone', findByTelDTO)
      .getOne();
    return user;
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

  async checkAdmin(id: number) {
    return await this.baseRepository.findOne({
      where: { id, is_admin: 1 },
    });
  }
}
