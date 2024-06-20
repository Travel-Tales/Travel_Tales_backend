import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export enum VisibilityStatus {
  Public = 'Public',
  Private = 'Private',
}

@Entity()
export class TravelPost extends CoreEntity {
  @Column()
  @IsString()
  title: string;

  @Column({ unique: true })
  @IsString()
  content: string;

  @Column()
  @IsString()
  travelArea: string;

  @Column()
  @IsNumber()
  travelerCount: number;

  @Column()
  @IsNumber()
  budget: number;

  @Column()
  @IsString()
  thumnail: string;

  @Column()
  @IsDate()
  startDate: Date;

  @Column()
  @IsDate()
  endDate: Date;

  @Column({ default: VisibilityStatus.Public })
  @IsBoolean()
  visibilityStatus: VisibilityStatus;
}
