import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TravelPost } from './travel_post.entity';

@Entity()
export class TravelPostImage extends CoreEntity {
  @Column()
  @IsNumber()
  postId: number;

  @Column()
  @IsString()
  imageUrl: string;

  @ManyToOne(() => TravelPost, (travelPost) => travelPost.travelPostImage)
  @JoinColumn({ name: 'postId' })
  travelPost: TravelPost;
}
