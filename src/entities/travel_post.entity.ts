import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { UserTravelPost } from './user_travel_post.entity';

export enum VisibilityStatus {
  Public = 'Public',
  Private = 'Private',
}

@Entity()
export class TravelPost extends CoreEntity {
  @Column({ default: '제목 없음' })
  @IsString()
  title: string;

  @Column({ default: '' })
  @IsString()
  content: string;

  @Column({ default: null, nullable: true })
  @IsString()
  travelArea: string;

  @Column({ default: 0 })
  @IsNumber()
  travelerCount: number;

  @Column({ default: 0 })
  @IsNumber()
  budget: number;

  @Column({ default: '' })
  @IsString()
  thumnail: string;

  @Column({ default: new Date() })
  @IsDate()
  startDate: Date;

  @Column({ default: new Date() })
  @IsDate()
  endDate: Date;

  @Column({ default: VisibilityStatus.Public })
  @IsBoolean()
  visibilityStatus: VisibilityStatus;

  @OneToMany(
    () => UserTravelPost,
    (userTravelPost) => userTravelPost.travelPost,
    {
      onDelete: 'CASCADE',
    },
  )
  userTravelPost: UserTravelPost[];
}
