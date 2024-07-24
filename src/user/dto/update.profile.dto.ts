import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { MyProfileOutputDTO } from './myprofile.dto';

export class UpdateProfileInputDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '유저 닉네임' })
  nickname?: string;
}

export class UpdateProfileOutputDto extends PartialType(MyProfileOutputDTO) {}
