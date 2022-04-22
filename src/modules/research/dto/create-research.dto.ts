import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateResearchDto {
  @ApiProperty({ description: '科研名称' })
  @IsNotEmpty({ message: '请输入科研名称' })
  readonly researchName: string;        

  @ApiProperty({ description: '科研领域' })
  @IsNotEmpty({ message: '请选择科研领域' })
  readonly field: number;        

  @ApiProperty({ description: '项目类别' })
  @IsNotEmpty({ message: '请选择项目类别' })
  readonly category: number;        

  @ApiProperty({ description: '申请额度' })
  @IsNotEmpty({ message: '请输入申请额度' })
  readonly cost: number;     
  
  @ApiProperty({ description: '描述' })
  readonly description: string;  

  @ApiProperty({ description: '审核人' })
  readonly reviewer?: string;  
  
  @ApiProperty({ description: '是否审核通过' })
  readonly review?: number;  

}
