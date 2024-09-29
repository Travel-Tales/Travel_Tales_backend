import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { UserTravelPost } from './user_travel_post.entity';
import { FileAttachment } from './file_attachment.entity';

export type VisibilityStatus = 'Public' | 'Private';

@Entity()
export class TravelPost extends CoreEntity {
  @Column({ default: '제목 없음' })
  @IsString()
  title: string;

  @Column({ type: 'text', default: '' })
  @IsString()
  content: string;

  @Column({ default: null, nullable: true })
  @IsString()
  travelArea: string;

  @Column({ default: 0 })
  @IsNumber()
  travelerCount: number;

  @Column({ default: 0 })
  @IsString()
  budget: string;

  @Column({ default: '' })
  @IsString()
  thumbnail: string;

  @Column({ default: new Date() })
  @IsDate()
  startDate: Date;

  @Column({ default: new Date() })
  @IsDate()
  endDate: Date;

  @Column({ default: 'Public' })
  @IsString()
  visibilityStatus: VisibilityStatus;

  @OneToMany(() => UserTravelPost, (userTravelPost) => userTravelPost.travelPost)
  userTravelPost: UserTravelPost[];

  @OneToMany(() => FileAttachment, (fileAttachment) => fileAttachment.id)
  fileAttachment: FileAttachment[];
}
