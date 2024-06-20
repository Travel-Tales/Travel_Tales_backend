import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/core.output';
import { TravelPost, ViewType } from 'src/entities';

export class CreateInput {
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

  @IsEnum(ViewType)
  viewType: ViewType;
}

export class CreateOutPut extends TravelPost {}
