import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CoreOutput<T> {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsNumber()
  data: T;
}
