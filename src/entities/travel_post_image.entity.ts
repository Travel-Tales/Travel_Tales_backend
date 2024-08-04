import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TravelPost } from './travel_post.entity';

@Entity()
export class TravelPostImage extends CoreEntity {
  @Column()
  @IsNumber()
  postId: number;

  @Column('simple-array')
  imageUrl: string;

  @OneToOne(() => TravelPost, (travelPost) => travelPost.travelPostImage)
  @JoinColumn({ name: 'postId' })
  travelPost: TravelPost;
}
