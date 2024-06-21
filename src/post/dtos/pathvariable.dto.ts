import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({ type: Number, description: 'ID of the resource' })
  @Type(() => Number)
  @IsInt()
  id: number;
}
