import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { TravelPost, VisibilityStatus } from 'src/entities';

export class CreateInputDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  travelArea: string;

  @IsNumber()
  travelerCount: number;

  @IsNumber()
  budget: number;

  @IsString()
  thumnail: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsEnum(VisibilityStatus)
  visibilityStatus: VisibilityStatus;
}

export class CreateOutPutDto extends TravelPost {}
