import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { join } from 'path';
import { SkipJwtAuth } from '../auth/constants';
import { SubPathDto } from './subPath.dto';

const uploadDistDir = join(__dirname, '../../', 'upload_dist');

@Controller('static')
export class StaticController {
  @SkipJwtAuth()
  @Get(':subPath')
  @ApiOperation({ summary: '下载文件' })
  render(@Param() subPathDto:SubPathDto, @Res() res) {
    const filePath = join(uploadDistDir, subPathDto.subPath);
    return res.sendFile(filePath);
  }
}
