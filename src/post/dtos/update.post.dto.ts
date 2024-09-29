import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsIn, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
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
  @IsOptional()
  @Transform(({ value }) => String(value))
  @IsString()
  budget?: string;

  @ApiProperty({ description: '이미지 URL들', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\[\s*(.*)\s*\]$/)
  imageUrl: string;

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
  @IsIn(['Public', 'Private'])
  visibilityStatus?: VisibilityStatus;
}
