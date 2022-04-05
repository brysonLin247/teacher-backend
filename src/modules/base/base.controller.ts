import { Controller, Body, Get, Post, Query, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { BaseService } from './base.service';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { BaseCreateDTO } from './dto/base-create.dto';
import { BaseEditDTO } from './dto/base-edit.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('base')
@ApiBearerAuth()
export class BaseController {
  constructor(private baseService: BaseService) { }

  @Get()
  @ApiOperation({ summary: '显示教师数据' })
  getMore(@Query() listDTO: ListDTO) {
    return this.baseService.getMore(listDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取教师详情' })
  getOne(@Param() idDTO: IdDTO) {
    return this.baseService.getOne(idDTO);
  }

  @Post()
  @ApiOperation({ summary: '创建教师信息' })
  create(@Body() baseCreateDTO: BaseCreateDTO) {
    return this.baseService.create(baseCreateDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑教师信息' })
  edit(@Param() idDTO: IdDTO, @Body() baseEditDTO: BaseEditDTO) {
    return this.baseService.edit(idDTO, baseEditDTO);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: '删除教师信息' })
  // delete(@Param() idDTO: IdDTO) {
  //   return this.baseService.delete(idDTO);
  // }

  @Delete()
  @ApiOperation({ summary: '批量删除教师信息' })
  deleteMore(@Body() idDTOs: IdDTO[]) {
    return this.baseService.deleteMore(idDTOs);
  }
}
