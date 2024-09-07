import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostQueryStringDTO {
  @ApiProperty({
    type: String,
    description: 'Title of the resource',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Country of the resource',
    required: false,
  })
  @IsOptional()
  @IsString()
  travelArea: string;
}
