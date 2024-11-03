import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsIn, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisibilityStatus } from 'src/entities';
export class UpdateReviewInputDto {
  @IsNumber()
  @ApiProperty({ description: '게시물 ID' })
  @Type(() => Number)
  postId: number;

  @ApiProperty({ description: '제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '썸네일 이미지 파일, 선택적 필드',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  thumbnailFile?: Express.Multer.File;
}
