import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class MyProfileOutputDTO {
  @IsNumber()
  @ApiProperty({ description: '유저 ID' })
  id: number;

  @IsString()
  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;

  @IsString()
  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @IsString()
  @ApiProperty({ description: '로그인 타입' })
  loginType: string;

  @IsString()
  @ApiProperty({ description: '유저 이미지 URL' })
  imageUrl: string;

  @IsDate()
  @ApiProperty({ description: '계정 생성일' })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: '계정 수정일' })
  updatedAt: Date;
}
