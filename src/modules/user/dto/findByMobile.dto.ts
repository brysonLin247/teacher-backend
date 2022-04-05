import { ApiProperty } from "@nestjs/swagger";
import { Matches } from "class-validator";
import { regMobileCN } from "src/utils/regex.util";

export class FindByMobileDTO {
  @ApiProperty({
    description: '手机号，唯一',
    example: '13580175405'
  })
  @Matches(regMobileCN, { message: '请输入正确手机号' })
  mobile: string;
}