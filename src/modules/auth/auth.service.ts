import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from 'src/utils/cryptogram.util';
import { BaseService } from '../base/base.service';
import { Base } from '../base/entities/base.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private baseService: BaseService, private jwtService: JwtService) { }
  
  async validateUser(telephone: string, password: string): Promise<any> {
    const user = await this.baseService.findByMobile({telephone})
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    const { password: dbPassword, salt } = user
    const currentHashPassword = encryptPassword(password, salt)
    
    if (currentHashPassword !== dbPassword) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    return user
  }

  async login(user: any) {
    const { telephone, password } = user;
    const payload = {
      telephone,
      password
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: jwtConstants.expiresIn,
      user: await this.baseService.findByMobile({ telephone })
    };
  }
}
