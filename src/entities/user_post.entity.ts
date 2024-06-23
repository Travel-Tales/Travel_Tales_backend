import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { TravelPost } from './travel_post.entity';

@Entity()
export class UserPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.post)
  user: User;

  @ManyToOne(() => TravelPost, (post) => post.user)
  post: TravelPost;
}
