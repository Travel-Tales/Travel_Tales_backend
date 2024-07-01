import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TravelPost } from './travel_post.entity';
import { User } from './user.entity';

@Entity()
export class UserTravelPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTravelPost, {
    eager: true,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.userTravelPost, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  travelPost: TravelPost;
}
