import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TravelReview } from 'src/entities/travel_review.entity';
import { Type } from 'class-transformer';

export class CreateInputDto {
  @IsNumber()
  @ApiProperty({ description: '게시물 ID' })
  @Type(() => Number)
  postId: number;

  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '제목' })
  content: string;

  @ApiProperty({
    description: '썸네일 이미지 파일, 선택적 필드',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  thumbnailFile?: Express.Multer.File;
}

export class CreateOutPutDto extends TravelReview {}
