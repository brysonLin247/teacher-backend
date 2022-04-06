import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseModule } from '../base/base.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [BaseModule, PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: `${jwtConstants.expiresIn}m` },
  }),],
  providers: [AuthService, LocalStrategy, JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
