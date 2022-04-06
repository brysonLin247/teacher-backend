import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { BaseService } from 'src/modules/base/base.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private baseService: BaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const existUser = this.baseService.findByMobile({telephone: payload.telephone});
    if (!existUser) {
      throw new UnauthorizedException();
    }

    return { 
      id: payload.id,
      name: payload.name,
      telephone: payload.telephone,
    };
  }
}
