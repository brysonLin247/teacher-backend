import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BaseCreateDTO {
  @ApiProperty({ description: '姓名' })
  @IsNotEmpty({ message: '请输入姓名' })
  readonly name: string;        //  姓名
  @ApiProperty({ description: '性别' })
  @IsNotEmpty({ message: '请输入性别' })
  readonly sex: string;  // 性别
  @ApiProperty({ description: '生日' })
  @IsNotEmpty({ message: '请输入生日' })
  readonly birth: string;      // 出生年月
  @ApiProperty({ description: '联系地址' })
  // @IsNotEmpty({ message: '请输入联系地址' })
  readonly location: string;  // 联系地址
  @ApiProperty({ description: '电话' })
  @IsNotEmpty({ message: '请输入电话' })
  readonly telephone: string;  // 电话
  @ApiProperty({ description: '详细介绍' })
  // @IsNotEmpty({ message: '请输入详细介绍' })
  readonly introduce: string;    // 详细介绍
  @ApiProperty({ description: '毕业院校' })
  // @IsNotEmpty({ message: '请输入毕业院校' })
  readonly graduation: string;      // 毕业院校
  @ApiProperty({ description: '学历' })
  // @IsNotEmpty({ message: '请输入学历' })
  readonly education: string;  // 学历
  @ApiProperty({ description: '部门' })
  @IsNotEmpty({ message: '请输入部门' })
  readonly apartment: string;  // 部门
  @ApiProperty({ description: '职称' })
  @IsNotEmpty({ message: '请输入职称' })
  readonly title: string;    // 职称
  @ApiProperty({ description: '任职状态' })
  @IsNotEmpty({ message: '请输入任职状态' })
  readonly status: string;    // 任职状态

  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  // @IsNotEmpty({ message: '请输入密码' })
  readonly password?: string;

  // @ApiProperty({
  //   description: '是否为管理员',
  //   example: 1
  // })

  // readonly is_admin: number;
}
