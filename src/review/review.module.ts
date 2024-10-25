import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { TravelReview } from 'src/entities/travel_review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TravelReview]), AwsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  //   exports: [UserService],
})
export class ReviewModule {}
