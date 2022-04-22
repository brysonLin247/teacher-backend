import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUploadDto {
  @ApiProperty({ description: '上传类型' })
  @IsNotEmpty({ message: '请输入上传类型' })
  readonly type: number;               

  @ApiProperty({ description: '申请的科研id' })
  readonly  researchId?: number;     
}
