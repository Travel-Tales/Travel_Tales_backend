import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TravelPost } from './travel_post.entity';
import { User } from './user.entity';

@Entity()
export class UserTravelPost {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userTravelPost)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.userTravelPost)
  @JoinColumn({ name: 'postId' })
  travelPost: TravelPost;
}
