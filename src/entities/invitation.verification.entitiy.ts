import { IsEmail, IsNumber, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class InvitationVerification extends CoreEntity {
  @Index('email-idx')
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsNumber()
  postId: string;

  @Column()
  @IsUUID()
  code: string;
}
