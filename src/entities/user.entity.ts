import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';
import { TravelPost } from './travel_post.entity';

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

  @ManyToMany(() => TravelPost, (travelpost) => travelpost.user)
  @JoinTable() // 중간 테이블 명시
  post: TravelPost[];
}
