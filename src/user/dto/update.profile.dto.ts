import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsFile } from 'nestjs-form-data';
import { MyProfileOutputDTO } from './myprofile.dto';

export class UpdateProfileInputDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '유저 닉네임' })
  nickname?: string;

  @IsFile()
  @IsOptional()
  file?: Express.Multer.File;
}

export class UpdateProfileOutputDto extends PartialType(MyProfileOutputDTO) {}
