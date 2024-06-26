import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';
import { TravelPost } from './travel_post.entity';
import { UserTravelPost } from './user_travel_post.entity';

export enum UserLoginType {
  Google = 'Google',
  Kakao = 'Kakao',
}

@Entity()
export class User extends CoreEntity {
  @Column()
  @IsString()
  nickname: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  loginType: UserLoginType;

  @Column({ default: '' })
  @IsString()
  imageUrl: string;

  @OneToMany(() => UserTravelPost, (userTravelPost) => userTravelPost.user)
  userTravelPost: UserTravelPost[];
}
