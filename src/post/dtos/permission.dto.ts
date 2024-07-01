import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PermissionInputDTO {
  @ApiProperty({ type: String, description: 'User email' })
  @IsEmail()
  email: string;
}
