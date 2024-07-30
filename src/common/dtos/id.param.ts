import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IDParamDTO {
  @ApiProperty({ type: String, description: 'ID of the resource' })
  @IsNumberString()
  id: number;
}
