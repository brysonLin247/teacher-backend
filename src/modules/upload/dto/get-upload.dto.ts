import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetUploadDto {
  @ApiProperty({ description: '上传类型' })
  @IsNotEmpty({ message: '请输入上传类型' })
  readonly type: number;

  @ApiProperty({ description: 'foreignId' })
  @IsNotEmpty({ message: '请输入foreignId' })
  readonly id: number;
}
