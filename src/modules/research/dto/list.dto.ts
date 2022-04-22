import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Matches } from "class-validator";
import { regPositive } from "src/utils/regex.util";

export class ListDto {
  @ApiProperty({ description: '科研名称', required: false })
  @IsOptional()
  readonly researchName?: string;

  @ApiProperty({ description: '科研领域', required: false })
  @IsOptional()
  readonly field?: number;

  @ApiProperty({ description: '项目类别', required: false })
  @IsOptional()
  readonly category?: number;

  @ApiProperty({ description: '是否审核通过', required: false })
  @IsOptional()
  readonly review?: number;

  @ApiProperty({ description: '审核人', required: false })
  @IsOptional()
  readonly reviewer?: string;

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
