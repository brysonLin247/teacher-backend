import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListDto } from './dto/list.dto';

@Controller('research')
@ApiBearerAuth()
export class ResearchController {
  constructor(private readonly researchService: ResearchService) { }

  @Post()
  @ApiOperation({ summary: '创建科研数据' })
  create(@Request() request, @Body() createResearchDto: CreateResearchDto) {
    return this.researchService.create(request.user.id, createResearchDto);
  }

  @Get()
  @ApiOperation({ summary: '显示科研数据' })
  findAll(@Request() request, @Query() listDto: ListDto) {
    return this.researchService.findAll(request.user,listDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.researchService.findOne(+id);
  // }

  @Patch(':id')
  @ApiOperation({ summary: '修改科研数据' })
  update(@Request() request, @Param('id') id: string, @Body() updateResearchDto: UpdateResearchDto) {
    return this.researchService.update(request.user, +id, updateResearchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除科研数据' })
  remove(@Param('id') id: string) {
    return this.researchService.remove(+id);
  }
}
