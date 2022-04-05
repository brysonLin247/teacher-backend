import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipJwtAuth } from './constants';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('登录验证')
@Controller('auth')
export class AuthController {
  constructor(private authService:AuthService) {}

  @ApiBody({ type: LoginDTO })
  @SkipJwtAuth()
  @Post('login')
  async login(@Body() loginDTO:LoginDTO){
    return await this.authService.login(loginDTO);
  }
}
