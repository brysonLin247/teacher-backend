import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Matches } from "class-validator";
import { regPositive } from "src/utils/regex.util";

export class ListDTO {
  @ApiProperty({ description: '姓名', required: false })
  @IsOptional()
  readonly name?: string;        //  姓名

  @ApiProperty({ description: '性别', required: false })
  @IsOptional()
  readonly sex?: string;  // 性别

  @ApiProperty({ description: '生日', required: false })
  @IsOptional()
  readonly birth?: string;      // 出生年月

  @ApiProperty({ description: '联系地址', required: false })
  @IsOptional()
  readonly location?: string;  // 联系地址

  @ApiProperty({ description: '电话', required: false })
  readonly telephone?: string;  // 电话

  @ApiProperty({ description: '毕业院校', required: false })
  @IsOptional()
  readonly graduation?: string;      // 毕业院校

  @ApiProperty({ description: '学历', required: false })
  @IsOptional()
  readonly education?: string;  // 学历

  @ApiProperty({ description: '部门', required: false })
  @IsOptional()
  readonly apartment?: string;  // 部门

  @ApiProperty({ description: '职称', required: false })
  @IsOptional()
  readonly title?: string;    // 职称

  @ApiProperty({ description: '任职状态', required: false })
  @IsOptional()
  readonly status?: string;    // 任职状态

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
