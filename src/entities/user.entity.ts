import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString } from 'class-validator';

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

  @Column()
  @IsString()
  imageUrl: string;
}
