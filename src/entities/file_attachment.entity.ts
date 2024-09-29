import { IsString, IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';
import { TravelPost } from './travel_post.entity';

@Entity()
export class FileAttachment extends CoreEntity {
  @Column({ type: 'text', default: '' })
  @IsString()
  bucket: string;

  @Column({ default: '제목 없음' })
  @IsString()
  originalName: string;

  @Column()
  @IsString()
  mimeType: string;

  @Column()
  @IsString()
  hashName: string;

  @Column()
  @IsString()
  size: number;

  @Column()
  @IsString()
  fileType: string;

  @Column()
  @IsString()
  url: string;

  @Column()
  @IsNumber()
  id: number;
}
