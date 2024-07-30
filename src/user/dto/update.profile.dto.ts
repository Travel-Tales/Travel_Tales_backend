import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { MyProfileOutputDTO } from './myprofile.dto';

export class UpdateProfileInputDto {
  @ApiProperty({ description: '유저 닉네임', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    description: '프로필 이미지 파일, 선택적 필드',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  file?: Express.Multer.File;
}

export class UpdateProfileOutputDto extends PartialType(MyProfileOutputDTO) {}
