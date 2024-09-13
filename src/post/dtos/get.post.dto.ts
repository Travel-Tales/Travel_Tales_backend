import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsNumber, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { VisibilityStatus } from 'src/entities';
import { MyProfileOutputDTO } from 'src/user/dto/myprofile.dto';

export class GetPostOutputDTO {
  @IsNumber()
  @ApiProperty({ description: '게시물 ID' })
  id: number;

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

  @IsIn(['Public', 'Private'])
  @ApiProperty({ description: '공개여부' })
  visibilityStatus: VisibilityStatus;

  @IsDate()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: '수정일' })
  updatedAt: Date;
}
