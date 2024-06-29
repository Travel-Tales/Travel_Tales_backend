import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
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
  thumnail: string;

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

  @Type(() => MyProfileOutputDTO)
  @ApiProperty({ type: [MyProfileOutputDTO], description: '유저 여행 게시물' })
  userTravelPost: MyProfileOutputDTO[];

  @IsDate()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: '수정일' })
  updatedAt: Date;
}
