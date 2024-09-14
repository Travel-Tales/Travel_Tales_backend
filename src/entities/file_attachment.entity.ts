import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, Index, Unique } from 'typeorm';

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
  fileName: string;

  @Column()
  @IsString()
  folder: string;

  @Column()
  @IsString()
  hashName: string;
}
