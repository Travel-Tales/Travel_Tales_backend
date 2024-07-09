import { IsBoolean, IsEmail, IsNumber, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@Unique(['email', 'postId'])
export class InvitationVerification extends CoreEntity {
  @Index('email-idx')
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsNumber()
  postId: number;

  @Column()
  @IsUUID()
  code: string;

  @Column({ default: false })
  @IsBoolean()
  isInvitation: boolean;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
