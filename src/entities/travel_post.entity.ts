import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { User } from './user.entity';

export enum VisibilityStatus {
  Public = 'Public',
  Private = 'Private',
}

@Entity()
export class TravelPost extends CoreEntity {
  @Column()
  @IsString()
  title: string;

  @Column()
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

  @ManyToMany(() => User, (user) => user.id)
  user: User[];
}
