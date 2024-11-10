import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../aws/aws.module';
import { FileAttachment } from '../entities';
import { TravelReview } from '../entities/travel_review.entity';
import { PostModule } from '../post/post.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TravelReview, FileAttachment]), PostModule, AwsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
