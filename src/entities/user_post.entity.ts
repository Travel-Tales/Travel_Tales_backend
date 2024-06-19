import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsNumber } from 'class-validator';

@Entity()
export class UserPost extends CoreEntity {
  @Column()
  @IsNumber()
  user_id: number;

  @Column()
  @IsNumber()
  board_id: number;
}
