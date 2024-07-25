import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisibilityStatus } from 'src/entities';
export class UpdatePostInputDto {
  @ApiProperty({ description: '제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '여행 지역', required: false })
  @IsOptional()
  @IsString()
  travelArea?: string;

  @ApiProperty({ description: '여행자 수', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  travelerCount?: number;

  @ApiProperty({ description: '예산', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({
    description: '썸네일 이미지 파일, 선택적 필드',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  thumbnailFile?: Express.Multer.File;

  @Type(() => Date)
  @ApiProperty({ description: '여행 시작 날짜', required: false })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Type(() => Date)
  @ApiProperty({ description: '여행 마감 날짜', required: false })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: '공개여부', required: false })
  @IsOptional()
  @IsEnum(VisibilityStatus)
  visibilityStatus?: VisibilityStatus;
}
