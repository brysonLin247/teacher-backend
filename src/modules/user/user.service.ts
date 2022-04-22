import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from 'src/utils';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram.util';
import { Repository } from 'typeorm';
import { FindByMobileDTO } from './dto/findByMobile.dto';
import { ListDTO } from './dto/list.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserEditDTO } from './dto/user-edit.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // 校验注册信息
  async checkRegisterForm(
    registerDTO: RegisterDTO,
  ): Promise<any> {
    if (registerDTO.password !== registerDTO.passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致，请检查')
    }
    const { mobile } = registerDTO
    const hasUser = await this.userRepository.findOne({ mobile })
    if (hasUser) {
      throw new NotFoundException('用户已存在')
    }
  }

  // 注册
  async register(
    registerDTO: RegisterDTO
  ): Promise<any> {
    await this.checkRegisterForm(registerDTO);

    const { nickname, password, mobile, is_admin } = registerDTO;
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt);  // 加密密码

    const newUser: User = new User()
    newUser.nickname = nickname
    newUser.mobile = mobile
    newUser.password = hashPassword
    newUser.salt = salt
    newUser.is_admin = is_admin;
    return await this.userRepository.save(newUser)
  }

  async getMore(listDTO: ListDTO) {
    const { page = 1, pageSize = 10 } = listDTO;

    const getList = await this.userRepository
      .createQueryBuilder('user')
      .where({ isDelete: false })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page)

    return {
      list,
      pagination,
    }
  }

  async edit(id: number, userEditDTO: UserEditDTO): Promise<any> {
    let userToEdit = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    userToEdit.mobile = userEditDTO.mobile;
    userToEdit.nickname = userEditDTO.nickname;
    userToEdit.password = userEditDTO.password;
    userToEdit.is_admin = userEditDTO.is_admin;
    const result = await this.userRepository.save(userToEdit);
    return result;
  }

  async delete(id: number) {
    let userToDelete = await this.userRepository.findOne({ id });
    userToDelete.isDelete = true;
    const result = await this.userRepository.save(userToDelete);
    return result;
  }

  async checkAdmin(id: number) {
    return await this.userRepository.findOne({
      where: { id, is_admin: 1 },
    });
  }
}
