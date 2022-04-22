import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateDocumentsDto {
  @ApiProperty({ description: '公文标题' })
  @IsNotEmpty({ message: '请输入公文标题' })
  title:string;
  @ApiProperty({ description: '公文类别' })
  @IsNotEmpty({ message: '请选择公文类别' })
  type:number;
  @ApiProperty({ description: '公文内容' })
  @IsNotEmpty({ message: '请输入公文内容' })
  content:string;
  @ApiProperty({ description: '作者' })
  @IsNotEmpty({ message: '请输入作者' })
  author:string;
  @ApiProperty({ description: '封面图片' })
  picUrl?:string;
}
