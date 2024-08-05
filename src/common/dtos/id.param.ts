import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IDParamDTO {
  @ApiProperty({ type: String, description: 'ID of the resource' })
  @IsNumber()
  @Type(() => Number)
  id: number;
}
