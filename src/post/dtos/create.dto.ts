import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TravelPost, VisibilityStatus } from 'src/entities';

export class CreateInputDto {
  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '내용' })
  content: string;

  @IsString()
  @ApiProperty({ description: '여행 지역' })
  travelArea: string;

  @IsNumber()
  @ApiProperty({ description: '여행자 수' })
  travelerCount: number;

  @IsNumber()
  @ApiProperty({ description: '예산' })
  budget: number;

  @IsString()
  @ApiProperty({ description: '썸네일 이미지' })
  thumbnail: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ description: '여행 시작 날짜' })
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ description: '여행 마감 날짜' })
  endDate: Date;

  @IsEnum(VisibilityStatus)
  @ApiProperty({ description: '공개여부' })
  visibilityStatus: VisibilityStatus;
}

export class CreateOutPutDto extends TravelPost {}
