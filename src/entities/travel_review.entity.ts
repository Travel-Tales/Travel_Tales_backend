import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { TravelPost } from './travel_post.entity';

@Entity()
export class TravelReview extends CoreEntity {
  @Column({ type: 'text', default: '' })
  @IsString()
  content: string;

  @Column({ default: '' })
  @IsString()
  thumbnail: string;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.id)
  travelReview: TravelPost;
}
