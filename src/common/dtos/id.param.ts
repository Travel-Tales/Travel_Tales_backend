import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IDParamDTO {
  @ApiProperty({
    type: Number,
    description: 'ID of the resource',
  })
  @IsNumber({}, { message: 'ID must be a valid number' })
  @Type(() => Number)
  id: number;
}
