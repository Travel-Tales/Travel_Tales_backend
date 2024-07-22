import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from 'src/entities';
import { MyProfileOutputDTO } from './myprofile.dto';

export class UpdateProfileInputDto {
  @IsString()
  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;
}

export class UpdateProfileOutputDto extends PartialType(MyProfileOutputDTO) {}
