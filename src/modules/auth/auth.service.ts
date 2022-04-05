import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils/cryptogram.util';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,private jwtService: JwtService){}
  // local策略可能才需要使用，先注释
  // async validateUser(mobile: string, password: string): Promise<any> {
  //   const user = await this.userService.findByMobile(mobile)
  //   if (!user) {
  //     throw new NotFoundException('用户不存在')
  //   }
  //   const { password: dbPassword, salt } = user
  //   const currentHashPassword = encryptPassword(password, salt)
  //   if (currentHashPassword !== dbPassword) {
  //     throw new NotFoundException('密码错误')
  //   }

  //   return user
  // }

  async login(user:any) {
    const payload = { 
      id: user.id,
      nickname: user.nickname,
      mobile: user.mobile,
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: jwtConstants.expiresIn,
      user: await this.userService.findByMobile({mobile:user.mobile})
    };
  }
}
