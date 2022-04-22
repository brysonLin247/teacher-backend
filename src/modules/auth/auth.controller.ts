import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipJwtAuth } from './constants';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('登录验证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiBody({ type: LoginDTO })
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async login(@Body() loginDTO:LoginDTO){
    return await this.authService.login(loginDTO);
  }
}
