import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Matches } from "class-validator";
import { regPositive } from "src/utils/regex.util";

export class ListDto {
  @ApiProperty({ description: '公文标题', required: false })
  @IsOptional()
  title?: string;
  @ApiProperty({ description: '公文类别', required: false })
  @IsOptional()
  type?: number;
  @ApiProperty({ description: '公文内容', required: false })
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: '第几页',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Matches(regPositive, { message: 'page 不可小于 0' })
  readonly page?: number;

  @ApiProperty({
    description: '每页数据条数',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Matches(regPositive, { message: 'pageSize 不可小于 0' })
  readonly pageSize?: number;
}