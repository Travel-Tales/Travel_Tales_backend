import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TravelPost } from './travel_post.entity';
import { User } from './user.entity';

@Entity()
export class UserTravelPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTravelPost, { eager: true })
  user: User;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.userTravelPost)
  travelPost: TravelPost;
}
