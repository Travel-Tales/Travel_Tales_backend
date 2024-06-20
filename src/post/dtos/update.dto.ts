import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateInputDto } from './create.dto';

export class UpdateInputDto extends PickType(PartialType(CreateInputDto), [
  'title',
  'content',
  'travelArea',
  'travelerCount',
  'budget',
  'thumnail',
  'startDate',
  'endDate',
  'visibilityStatus',
]) {}
