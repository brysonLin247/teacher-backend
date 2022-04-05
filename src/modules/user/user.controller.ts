import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SkipJwtAuth } from '../auth/constants';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.interface';
import { FindByMobileDTO } from './dto/findByMobile.dto';
import { ListDTO } from './dto/list.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserEditDTO } from './dto/user-edit.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @SkipJwtAuth()
  @Post('register')
  @ApiOperation({summary:'注册账户'})
  async register(
    @Body() registerDTO: RegisterDTO
  ): Promise<any> {
    return this.userService.register(registerDTO)
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('getAll')
  @ApiOperation({summary:'显示所有用户'})
  async getMore(@Query() listDTO: ListDTO) {
    return await this.userService.getMore(listDTO);
  }

  @Get('findByMobile')
  @ApiOperation({summary:'通过手机号查找用户'})
  async findMyMobile(@Query() findByMobileDTO:FindByMobileDTO) {
    return await this.userService.findByMobile(findByMobileDTO);
  }

  @Patch(':id')
  @ApiOperation({summary:'修改用户'})
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() userEditDTO: UserEditDTO,
  ) {
    return this.userService.edit(id, userEditDTO);
  }

  @Delete(':id')
  @ApiOperation({summary:'删除用户'})
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
