import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SubPathDto {
  @ApiProperty({ description: 'subPath' })
  @IsNotEmpty({ message: '请输入subPath' })
  subPath:string;
}