import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateDocumentsDto } from './create-documents.dto';

export class UpdateDocumentsDto extends PartialType(CreateDocumentsDto) {
  @ApiProperty({ description: '公文id' })
  @IsNotEmpty({ message: '请输入公文id' })
  id:number;
}
