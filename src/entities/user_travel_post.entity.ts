import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TravelPost } from './travel_post.entity';
import { User } from './user.entity';

@Entity()
export class UserTravelPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTravelPost, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.userTravelPost, {
    cascade: true,
  })
  @JoinColumn()
  travelPost: TravelPost;
}
