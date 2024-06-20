import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelPost } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TravelPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
